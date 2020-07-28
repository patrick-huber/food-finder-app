import React, { Component } from 'react';
import { compose } from 'recompose';

import { Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import { withAuthorization, withEmailVerification } from '../Session';

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
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import EventIcon from '@material-ui/icons/Event';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { set, setMinutes, getMinutes, setHours, getHours, startOfDay, addDays } from 'date-fns';

import DateFnsUtils from '@material-ui/pickers/adapter/date-fns';
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from '@material-ui/pickers';

import { withStyles } from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';

import LocationSearchInput from '../PlacesAutocomplete';

const styles = theme => ({
  root: {
    backgroundColor: "red"
  },
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
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  submitWrapper: {
    margin: theme.spacing(1),
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

class EventEdit extends Component {
  constructor(props) {
    super(props);
    const today = startOfDay(new Date());

    this.state = {
      loading: false,
      updatingFirestore: false,
      errorMissing: false,
      errorEndTime: false,
      errorEndTimeText: null,
      newEvent: true,
      event: null,
      recurring: "no",
      daysSet: new Set(),
      formData: {
        vendor: this.props.authUser.vendor,
        location: null,
        address: null,
        start_time: set(today, { hours: 11, minutes: 0 }),
        end_time: set(today, { hours: 19, minutes: 0 }),
        recurring_start: today,
        recurring_end: today,
        days: [],
        notes: null,
        last_updated: today,
      }
    };
  }

  componentDidMount() {
    if(this.props.match.path === ROUTES.EVENT_NEW) return;

    this.setState({ loading: true });

    this.props.firebase
      .calendarDetails(this.props.match.params.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          // Check for recurring event and format firestore dates
          const recurring = doc.data().recurring_start ? "yes" : "no";
          const daysSet = new Set(doc.data().days);
          let formData = doc.data();
              formData.start_time = doc.data().start_time.toDate();
              formData.end_time = doc.data().end_time.toDate();
              formData.recurring_start = doc.data().recurring_start ? doc.data().recurring_start.toDate() : this.state.formData.recurring_start;
              formData.recurring_end = doc.data().recurring_end ? addDays(doc.data().recurring_end.toDate(), -1) : this.state.formData.recurring_end;
              formData.last_updated = doc.data().last_updated ? doc.data().last_updated.toDate() : this.state.formData.last_updated;

          console.log("Document data:", doc.data());

          this.setState({
            newEvent: false,
            event: doc.data(),
            formData: formData,
            loading: false,
            recurring: recurring,
            daysSet: daysSet,
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  locationValueChange = (value, geo) => {
    let newFormData = this.state.formData;
    newFormData['location'] = geo.geometry.location;
    newFormData['address'] = value.description;

    this.setState({
      formData: newFormData,
    });
  }

  handleStartDateChange = (time) => {
    let formData = this.state.formData;
        formData['start_time'] = time;

    let endDate = setMinutes(time, getMinutes(this.state.formData.end_time));
        endDate = setHours(endDate, getHours(this.state.formData.end_time));

    formData['end_time'] = endDate;
    formData['recurring_start'] = startOfDay(time);

    this.setEndDateError(endDate <= formData.start_time);
    this.setState( {
      formData: formData,
    });
  }

  handleEndHourChange = (time) => {
    let formData = this.state.formData;
        formData['end_time'] = time;

    let tempEndTime = setHours(formData.start_time, getHours(time));
        tempEndTime = setMinutes(tempEndTime, getMinutes(time));

    this.setEndDateError(tempEndTime <= formData.start_time);
    this.setState( {
      formData: formData,
    });
  }

  handleRecurringEndDateChange = (time) => {
    let formData = this.state.formData;
        formData['recurring_end'] = startOfDay(time);

    this.setState( {
      formData: formData,
    });
  }

  setEndDateError = (state) => {
    const errorText = state ? "Closing time must be after opening time." : null;

    this.setState( {
      errorEndTime: state,
      errorEndTimeText: errorText,
    });
  }

  handleRecurringChange = (value) => {
    // Check closing date > opening date
    this.setState( {
      recurring: value,
    });
  }

  handleDayChange = (add,field) => {
    var formData = {...this.state.formData}

    if(add) {
      this.state.daysSet.add(field);
    } else {
      this.state.daysSet.delete(field);
    }
    formData.days = [...this.state.daysSet].sort();

    this.setState({formData});
  }

  handleNotesChange = (value) => {
    let newFormData = this.state.formData;
    newFormData['notes'] = value.target.value;

    this.setState( {
      formData: newFormData,
    });
  }

  submitForm = (e) => {
    let data = this.state.formData;
    e.preventDefault();
    this.setState({errorMissing: false});

    // Set update time
    data['last_updated'] = new Date();

    // Validation
    for (const [key, value] of Object.entries(data)) {
      if(!value && key !== 'notes') {
        console.log('missing field: '+ key)
        return this.setState({errorMissing: true});
      }
    }

    // Update data for firestore
    // Add one day to last recurring day to account for final day
    data['recurring_end'] = addDays(data.recurring_end, 1);
    
    if(data.location.toJSON) {
      // Convert location to GeoPoint object
      const locationObj = data.location.toJSON();
      data['location'] = new this.props.firebase.firestore.GeoPoint(locationObj.lat, locationObj.lng);
    }

    // remove recurring fields for one-time event
    if(this.state.recurring === "no") {
      delete data.recurring_end;
      delete data.recurring_start;
      delete data.days;
    }
    if(!data.notes) {
      delete data.notes;
    }

    if(this.state.newEvent) {
      this.addEventFirestore(data);
    } else {
      this.updateEventFirestore(data);
    }

  }

  addEventFirestore = (eventData) => {
    this.setState({updatingFirestore: true});
    this.props.firebase.calendar().add(eventData)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        this.props.history.push({
          pathname: ROUTES.EVENTS,
          state: { action: 'Event created successfully.' }
        });
      })
      .catch((error) => {
        alert("Error adding new event. Please reach out to support with these error details: " + error);
        this.setState({updatingFirestore: false});
      });
  }

  updateEventFirestore = (eventData) => {
    this.setState({updatingFirestore: true});
    this.props.firebase
      .calendarDetails(this.props.match.params.id)
      .update(eventData)
      .then(() => {
        console.log("Document updated");
        this.props.history.push({
          pathname: ROUTES.EVENTS,
          state: { action: 'Event updated successfully.' }
        });
      })
      .catch((error) => {
        alert("Error adding new event. Please reach out to support with these error details: " + error);
        this.setState({updatingFirestore: false});
      });
  }

  render() {
    const { newEvent, updatingFirestore, errorMissing, errorEndTime, errorEndTimeText, event, loading, formData, recurring, daysSet } = this.state;
    const { classes } = this.props;
    const headerText = newEvent ? 'New Event' : 'Edit Event';

    return (
      <React.Fragment>
      <CssBaseline />
      <div className={classes.appBarSpacer} />
        <main>
          <Container className={classes.section} maxWidth="sm">
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="previous page">
                <ArrowBackIcon onClick={() => { this.props.history.goBack() }} />
              </IconButton>
            </Toolbar>
            <Paper elevation={0} className={classes.paperCallout}>
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                  <Avatar className={classes.avatar}>
                    <EventIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    {headerText}
                  </Typography>
                  {loading &&
                    <Fullscreen />
                  }
                  <LocalizationProvider dateAdapter={DateFnsUtils}>
                    <form className={classes.form}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                          <FormControl required fullWidth component="fieldset">
                            <RadioGroup row aria-label="one time or recurring event" name="recurring" value={recurring} onChange={(e, value) => {this.handleRecurringChange(value)}}>
                              <FormControlLabel value="no" control={<Radio />} label="One Time" />
                              <FormControlLabel value="yes" control={<Radio />} label="Recurring" />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <LocationSearchInput defaultValue={formData.address} valueChange={(value,geo) => {this.locationValueChange(value,geo)}} />
                        </Grid>
                        {recurring === "no" &&
                        <Grid item xs={12} sm={12}>
                          <DatePicker
                            disablePast
                            id="start-date-picker"
                            label="Date"
                            value={formData.start_time}
                            onChange={(value) => {this.handleStartDateChange(value)}}
                            KeyboardButtonProps={{
                              'aria-label': 'change event date',
                            }}
                            renderInput={props => <TextField required fullWidth variant="outlined" {...props} helperText={null} />}
                          />
                        </Grid>
                        } {recurring === "yes" &&
                          <React.Fragment>
                            <Grid item xs={12} sm={6}>
                              <DatePicker
                                disablePast
                                id="recurring-start-date-picker"
                                label="First Day"
                                value={formData.start_time}
                                onChange={(value) => {this.handleStartDateChange(value)}}
                                KeyboardButtonProps={{
                                  'aria-label': 'change recurring start date',
                                }}
                                renderInput={props => <TextField required fullWidth variant="outlined" {...props} helperText={null} />}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <DatePicker
                                disablePast
                                id="recurring-end-date-picker"
                                label="Last Day"
                                value={formData.recurring_end}
                                minDate={formData.start_time}
                                onChange={(value) => {this.handleRecurringEndDateChange(value)}}
                                KeyboardButtonProps={{
                                  'aria-label': 'change recurring end date',
                                }}
                                renderInput={props => <TextField required fullWidth variant="outlined" {...props} helperText={null} />}
                              />
                            </Grid>
                          </React.Fragment>
                        }
                        <Grid item xs={12} sm={6}>
                          <TimePicker
                            id="start-time-picker"
                            label="Opening time"
                            value={formData.start_time}
                            onChange={(value) => {this.handleStartDateChange(value)}}
                            KeyboardButtonProps={{
                              'aria-label': 'change opening time',
                            }}
                            renderInput={props => <TextField {...props} error={errorEndTime} helperText={null} required fullWidth variant="outlined" />}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TimePicker
                            id="end-time-picker"
                            label="Closing time"
                            value={formData.end_time}
                            onChange={(value) => {this.handleEndHourChange(value)}}
                            KeyboardButtonProps={{
                              'aria-label': 'change closing time',
                            }}
                            renderInput={props => <TextField {...props} error={errorEndTime} helperText={errorEndTimeText} required fullWidth variant="outlined"  />}
                          />
                        </Grid>
                        {recurring === "yes" &&
                          <Grid item xs={12} sm={6}>
                            <FormControl component="fieldset">
                              <FormLabel component="legend">Days</FormLabel>
                              <FormGroup>
                                <FormControlLabel
                                  control={<Checkbox checked={daysSet.has(1)} onChange={(e, value) => {this.handleDayChange(value,1)}} name="Monday" />}
                                  label="Monday"
                                />
                                <FormControlLabel
                                  control={<Checkbox checked={daysSet.has(2)} onChange={(e, value) => {this.handleDayChange(value,2)}} name="Tuesday" />}
                                  label="Tuesday"
                                />
                                <FormControlLabel
                                  control={<Checkbox checked={daysSet.has(3)} onChange={(e, value) => {this.handleDayChange(value,3)}} name="Wednesday" />}
                                  label="Wednesday"
                                />
                                <FormControlLabel
                                  control={<Checkbox checked={daysSet.has(4)} onChange={(e, value) => {this.handleDayChange(value,4)}} name="Thursday" />}
                                  label="Thursday"
                                />
                                <FormControlLabel
                                  control={<Checkbox checked={daysSet.has(5)} onChange={(e, value) => {this.handleDayChange(value,5)}} name="Friday" />}
                                  label="Friday"
                                />
                                <FormControlLabel
                                  control={<Checkbox checked={daysSet.has(6)} onChange={(e, value) => {this.handleDayChange(value,6)}} name="Saturday" />}
                                  label="Saturday"
                                />
                                <FormControlLabel
                                  control={<Checkbox checked={daysSet.has(0)} onChange={(e, value) => {this.handleDayChange(value,0)}} name="Sunday" />}
                                  label="Sunday"
                                />
                              </FormGroup>
                            </FormControl>
                          </Grid>
                        }
                        <Grid item xs={12} sm={12}>
                          <TextField fullWidth id="notes" label="Notes" variant="outlined" onChange={(value) => {this.handleNotesChange(value)}} />
                        </Grid>
                      </Grid>
                      <div className={classes.submitWrapper}>
                        <Button
                          type="submit"
                          disabled={errorEndTime || updatingFirestore}
                          fullWidth
                          variant="contained"
                          color="primary"
                          className={classes.submit}
                          onClick={(event) => {this.submitForm(event)}}
                        >
                          {newEvent ? 'Create Event': 'Edit Event'}
                        </Button>
                        {updatingFirestore && <CircularProgress size={24} className={classes.buttonProgress} />}
                      </div>
                      {errorMissing && <FormHelperText error aria-label="missing required fields">Please fill out all required fields marked with an asterisk (*)</FormHelperText>}
                    </form>
                  </LocalizationProvider>
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
  withEmailVerification,
  withAuthorization(condition),
)(EventEdit);
