import React, { Component } from 'react';
import { compose } from 'recompose';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import { withAuthorization } from '../Session';

import Footer from '../Footer';
import { Fullscreen } from '../Loading';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import StorefrontIcon from '@material-ui/icons/Storefront';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { withStyles } from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';

import { IMaskMixin } from 'react-imask';

const styles = theme => ({
  appBarSpacer: theme.mixins.toolbar,
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  section: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  paperCallout: {
    marginBottom: 20,
    padding: 20,
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(1, 0),
  },
  submitWrapper: {
    margin: theme.spacing(2, 0, 0),
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

const MaskedInput = IMaskMixin(({inputRef, ...props}) => (
  <TextField
    {...props}
    inputRef={inputRef}  // bind internal input (if you use styled-components V4, use "ref" instead "innerRef")
  />
));

class VendorEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      updatingFirestore: false,
      errorText: null,
      errorMissing: false,
      errorWebsite: false,
      errorMenu: false,
      newVendor: true,
      vendor: null,
      paymentOptionsSet: new Set(),
      formData: {
        name: '',
        description: '',
        phone: '',
        photo: '',
        website: '',
        menu: '',
        instagram: '',
        facebook: '',
        payment_options: [],
        updated_by: this.props.authUser.email,
      }
    };
  }

  componentDidMount() {
    if(this.props.match.path === ROUTES.VENDOR_NEW) return;

    // check if user is authenticated to edit this vendor
    if(this.props.match.params.id !== this.props.authUser.vendor && !this.props.authUser.roles[ROLES.ADMIN]) {
      alert('You are no authorized to edit this vendor.');
      this.props.history.push(ROUTES.EVENTS);
    }

    this.setState({ loading: true });

    this.props.firebase
      .vendor(this.props.match.params.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const paymentOptionsSet = new Set(doc.data().payment_options);
          let formData = doc.data();

          this.setState({
            newVendor: false,
            vendor: doc.data(),
            formData: formData,
            paymentOptionsSet: paymentOptionsSet,
            loading: false,
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
  }

  handleTextFieldChange = (field, value) => {
    let newFormData = this.state.formData;
    newFormData[field] = value.target.value;

    this.setState( {
      formData: newFormData,
    });
  }

  handleMaskedInputChange = (field, value) => {
    let newFormData = this.state.formData;
    newFormData[field] = value;

    this.setState( {
      formData: newFormData,
    });
  }

  handlePaymentOptionsChange = (add,field) => {
    var formData = {...this.state.formData}

    if(add) {
      this.state.paymentOptionsSet.add(field);
    } else {
      this.state.paymentOptionsSet.delete(field);
    }
    formData.payment_options = [...this.state.paymentOptionsSet];

    this.setState({formData});
  }

  submitForm = (e) => {
    let data = {...this.state.formData};
    e.preventDefault();

    this.setState({errorText: null, errorMissing: false, errorWebsite: false, errorMenu: false,});

    // Set update time
    data['last_updated'] = new Date();

    // Name required
    if(!data.name) {
      return this.setState({errorText: 'Name of Food Stand is required.', errorMissing: true,});
    }
    // Website full address
    if(data.website) {
      if(data.website.indexOf('https://') + data.website.indexOf('http://') === -2) {
        return this.setState({errorText: 'Website address is not valid. It must start with https:// or http://', errorWebsite: true,});
      }
    }
    // Menu full address
    if(data.menu) {
      if(data.menu.indexOf('https://') + data.menu.indexOf('http://') === -2) {
        return this.setState({errorText: 'Online Menu address is not valid. It must start with https:// or http://', errorMenu: true,});
      }
    }

    if(this.state.newVendor) {
      this.addVendorFirestore(data);
    } else {
      this.updateVendorFirestore(data);
    }

  }

  addVendorFirestore = (vendorData) => {
    this.setState({updatingFirestore: true});
    this.props.firebase.vendors().add(vendorData)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        this.props.firebase.analytics.logEvent('vendor_add', {
          user: this.props.authUser.email,
          vendor: docRef.id,
        });

        // Switch new vendor to active vendor for user
        this.props.firebase
          .user(this.props.authUser.uid)
          .update({
            vendor: docRef.id,
          })
          .then(() => {
            alert("Food stand added.");
            this.props.history.push(ROUTES.EVENTS);
            window.location.reload(true);
          })
          .catch((error) => {
            alert("Error updating user. Error details: " + error);
          });
      })
      .catch((error) => {
        alert("Error adding new vendor. Please reach out to support with these error details: " + error);
        this.setState({updatingFirestore: false});
      });
  }

  updateVendorFirestore = (vendorData) => {
    this.setState({updatingFirestore: true});
    this.props.firebase
      .vendor(this.props.match.params.id)
      .update(vendorData)
      .then(() => {
        this.props.firebase.analytics.logEvent('vendor_edit', {
          user: this.props.authUser.email,
          vendor: this.props.match.params.id,
        });
        
        alert("Food stand updated.");

        this.props.history.push(ROUTES.EVENTS);
      })
      .catch((error) => {
        alert("Error updating vendor info. Please reach out to support with these error details: " + error);
        this.setState({updatingFirestore: false});
      });

  }

  render() {
    const { newVendor, updatingFirestore, errorText, errorMissing, errorWebsite, errorMenu, loading, formData, paymentOptionsSet } = this.state;
    const { classes } = this.props;
    const headerText = newVendor ? 'New Food Stand' : 'Edit Food Stand';

    return (
      <React.Fragment>
      <CssBaseline />
      <div className={classes.appBarSpacer} />
        <main>
          <Container className={classes.section} maxWidth="sm">
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="previous page" onClick={() => { this.props.history.goBack() }} >
                <ArrowBackIcon/>
              </IconButton>
            </Toolbar>
            <Paper elevation={0} className={classes.paperCallout}>
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                  <Avatar className={classes.avatar}>
                    <StorefrontIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    {headerText}
                  </Typography>
                  {loading &&
                    <Fullscreen />
                  }
                  <form className={classes.form} action={null}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField error={errorMissing} value={formData.name} fullWidth required id="name" label="Name of Food Stand" variant="outlined" onChange={(value) => {this.handleTextFieldChange('name',value)}} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField value={formData.description} fullWidth id="description" label="Description" variant="outlined" onChange={(value) => {this.handleTextFieldChange('description',value)}} />
                      </Grid>
                      <Grid item xs={12}>
                        <MaskedInput mask={'(000) 000-0000'} value={formData.phone} InputLabelProps={{ shrink: formData.phone }} fullWidth id="phone" label="Phone" variant="outlined" onAccept={(value, mask) => { this.handleMaskedInputChange('phone', value)}} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField error={errorWebsite} value={formData.website} fullWidth id="website" label="Website" helperText="Full website address (https://mysite.com or http://mysite.com)" variant="outlined" onChange={(value) => {this.handleTextFieldChange('website',value)}} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField error={errorMenu} value={formData.menu} fullWidth id="menu" label="Online Menu" helperText="Link to online menu (https://mysite.com/menu)" variant="outlined" onChange={(value) => {this.handleTextFieldChange('menu',value)}} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField value={formData.instagram} fullWidth id="instagram" label="Instagram" variant="outlined" onChange={(value) => {this.handleTextFieldChange('instagram',value)}}
                          InputProps={{
                            startAdornment: <InputAdornment>@</InputAdornment>,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField value={formData.facebook} fullWidth id="facebook" label="Facebook" variant="outlined" onChange={(value) => {this.handleTextFieldChange('facebook',value)}}
                          InputProps={{
                            startAdornment: <InputAdornment>https://facebook.com/</InputAdornment>,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Payment Options</FormLabel>
                          <FormGroup>
                            <FormControlLabel
                              control={<Checkbox checked={paymentOptionsSet.has('cash')} onChange={(e, value) => {this.handlePaymentOptionsChange(value,'cash')}} name="Cash" />}
                              label="Cash"
                            />
                            <FormControlLabel
                              control={<Checkbox checked={paymentOptionsSet.has('credit')} onChange={(e, value) => {this.handlePaymentOptionsChange(value,'credit')}} name="Credit Card" />}
                              label="Credit Card"
                            />
                            <FormControlLabel
                              control={<Checkbox checked={paymentOptionsSet.has('contactless')} onChange={(e, value) => {this.handlePaymentOptionsChange(value,'contactless')}} name="Apple & Google Pay (contactless)" />}
                              label="Apple & Google Pay (contactless)"
                            />
                            <FormControlLabel
                              control={<Checkbox checked={paymentOptionsSet.has('venmo')} onChange={(e, value) => {this.handlePaymentOptionsChange(value,'venmo')}} name="Venmo" />}
                              label="Venmo"
                            />
                            <FormControlLabel
                              control={<Checkbox checked={paymentOptionsSet.has('paypal')} onChange={(e, value) => {this.handlePaymentOptionsChange(value,'paypal')}} name="PayPal" />}
                              label="PayPal"
                            />
                          </FormGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <div className={classes.submitWrapper}>
                      {errorText && <FormHelperText error aria-label="missing required fields">{errorText}</FormHelperText>}
                      <Button
                        type="submit"
                        disabled={updatingFirestore}
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={(event) => {this.submitForm(event)}}
                      >
                        {newVendor ? 'Create Food Stand': 'Edit Food Stand'}
                      </Button>
                      {updatingFirestore && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                    <Button
                      disabled={updatingFirestore}
                      fullWidth
                      variant="outlined"
                      className={classes.submit}
                      onClick={() => { this.props.history.goBack() }}
                    >
                      Cancel
                    </Button>
                  </form>
                </div>
              </Container>
            </Paper>
          </Container>
        </main>
        <Footer />
      </React.Fragment>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withStyles(styles, { withTheme: true }),
  withAuthorization(condition),
)(VendorEdit);
