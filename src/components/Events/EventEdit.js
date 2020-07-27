import React, { Component } from 'react';
import { compose } from 'recompose';

import * as ROUTES from '../../constants/routes';

import { withFirebase } from '../Firebase';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import EventIcon from '@material-ui/icons/Event';
import Typography from '@material-ui/core/Typography';

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
});

class EventEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      newEvent: false,
      event: null,
      formData: {
        vendor: this.props.authUser.vendor,
        location: null,
        address: null,
        start_time: new Date(),
        end_time: new Date(),
        recurring_start: new Date(),
        recurring_end: new Date(),
        days: null,
        notes: null,
        last_updated: new Date(),
      },
      ...props.location.state,
    };
  }

  componentDidMount() {
    if(this.props.match.path === ROUTES.EVENT_NEW) {
      return this.setState({
        newEvent: true,
      });
    }

    if (this.state.event) {
      return;
    }

    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase
      .calendarDetails(this.props.match.params.id)
      .onSnapshot(snapshot => {
        this.setState({
          event: snapshot.data(),
          formData: snapshot.data(),
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  locationValueChange = (value, geo) => {
    this.setState( {
      formData: {
        location: geo.geometry.location,
        address: value.description,
        ...this.formData
      }
    });
  }

  handleStartDateChange = (time) => {
    this.setState( {
      formData: {
        start_time: time,
        ...this.formData
      }
    })
  }

  handleEndDateChange = (time) => {
    // Check closing date > opening date
    this.setState( {
      formData: {
        end_time: time,
        ...this.formData
      }
    })
  }

  render() {
    const { newEvent, event, loading, formData } = this.state;
    const { classes } = this.props;
    const headerText = newEvent ? 'New Event' : 'Edit Event';

    return (
      <React.Fragment>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <EventIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {headerText}
            </Typography>
            <LocalizationProvider dateAdapter={DateFnsUtils}>
              <form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <LocationSearchInput valueChange={(value,geo) => {this.locationValueChange(value,geo)}} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      disablePast
                      id="start-date-picker"
                      label="Date"
                      value={formData.start_time}
                      onChange={(value) => {this.handleStartDateChange(value)}}
                      KeyboardButtonProps={{
                        'aria-label': 'change start date',
                      }}
                      renderInput={props => <TextField required fullWidth variant="outlined" {...props} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TimePicker
                      id="start-time-picker"
                      label="Opening time"
                      value={formData.start_time}
                      onChange={(value) => {this.handleStartDateChange(value)}}
                      KeyboardButtonProps={{
                        'aria-label': 'change opening time',
                      }}
                      renderInput={props => <TextField required fullWidth variant="outlined" {...props} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TimePicker
                      id="start-time-picker"
                      label="Closing time"
                      value={formData.end_time}
                      onChange={(value) => {this.handleEndDateChange(value)}}
                      KeyboardButtonProps={{
                        'aria-label': 'change closing time',
                      }}
                      renderInput={props => <TextField required fullWidth variant="outlined" {...props} />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox value="allowExtraEmails" color="primary" />}
                      label="I want to receive inspiration, marketing promotions and updates via email."
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign Up
                </Button>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link href="#" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </LocalizationProvider>
          </div>
        </Container>
        {loading && <div>Loading ...</div>}
      </React.Fragment>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withFirebase,
)(EventEdit);
