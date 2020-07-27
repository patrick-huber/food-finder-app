import React, { Component } from 'react';
import { compose } from 'recompose';

import * as ROUTES from '../../constants/routes';

import { withFirebase } from '../Firebase';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
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
      recurring: "no",
      daysSet: new Set(),
      formData: {
        vendor: this.props.authUser.vendor,
        location: null,
        address: null,
        start_time: new Date(),
        end_time: new Date(),
        recurring_start: new Date(),
        recurring_end: new Date(),
        days: [],
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
    let newFormData = this.state.formData;
    newFormData['location'] = geo.geometry.location;
    newFormData['address'] = value.description;

    this.setState({
      formData: newFormData,
    });
  }

  handleStartDateChange = (time) => {
    let newFormData = this.state.formData;
    newFormData['start_time'] = time;

    this.setState( {
      formData: newFormData,
    });
  }

  handleEndDateChange = (time) => {
    // Check closing date > opening date
    let newFormData = this.state.formData;
    newFormData['end_time'] = time;

    this.setState( {
      formData: newFormData,
    });
  }

  handleRecurringChange = (value) => {
    // Check closing date > opening date
    this.setState( {
      recurring: value,
    });
  }

  handleDayChange = (add,field) => {
    if(add) {
      this.state.daysSet.add(field);
    } else {
      this.state.daysSet.delete(field);
    }
    console.log([...this.state.daysSet])
  }

  handleNotesChange = (value) => {
    let newFormData = this.state.formData;
    newFormData['notes'] = value;

    this.setState( {
      formData: newFormData,
    });
  }

  render() {
    const { newEvent, event, loading, formData, recurring } = this.state;
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
                  <Grid item xs={12} sm={12}>
                    <FormControl required fullWidth component="fieldset">
                      <RadioGroup row aria-label="one time or recurring event" name="recurring" value={recurring} onChange={(e, value) => {this.handleRecurringChange(value)}}>
                        <FormControlLabel value="no" control={<Radio />} label="One Time" />
                        <FormControlLabel value="yes" control={<Radio />} label="Recurring" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <LocationSearchInput valueChange={(value,geo) => {this.locationValueChange(value,geo)}} />
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
                        'aria-label': 'change start date',
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
                          label="Start Date"
                          value={formData.start_time}
                          onChange={(value) => {this.handleStartDateChange(value)}}
                          KeyboardButtonProps={{
                            'aria-label': 'change start date',
                          }}
                          renderInput={props => <TextField required fullWidth variant="outlined" {...props} helperText={null} />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          disablePast
                          id="recurring-end-date-picker"
                          label="End Date"
                          value={formData.end_time}
                          onChange={(value) => {this.handleEndDateChange(value)}}
                          KeyboardButtonProps={{
                            'aria-label': 'change end date',
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
                      renderInput={props => <TextField required fullWidth variant="outlined" {...props} helperText={null} />}
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
                      renderInput={props => <TextField required fullWidth variant="outlined" {...props} helperText={null} />}
                    />
                  </Grid>
                  {recurring === "yes" &&
                    <Grid item xs={12} sm={6}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Days</FormLabel>
                        <FormGroup>
                          <FormControlLabel
                            control={<Checkbox checked={formData.days[1]} onChange={(e, value) => {this.handleDayChange(value,1)}} name="Monday" />}
                            label="Monday"
                          />
                          <FormControlLabel
                            control={<Checkbox checked={formData.days[2]} onChange={(e, value) => {this.handleDayChange(value,2)}} name="Tuesday" />}
                            label="Tuesday"
                          />
                          <FormControlLabel
                            control={<Checkbox checked={formData.days[3]} onChange={(e, value) => {this.handleDayChange(value,3)}} name="Wednesday" />}
                            label="Wednesday"
                          />
                          <FormControlLabel
                            control={<Checkbox checked={formData.days[4]} onChange={(e, value) => {this.handleDayChange(value,4)}} name="Thursday" />}
                            label="Thursday"
                          />
                          <FormControlLabel
                            control={<Checkbox checked={formData.days[5]} onChange={(e, value) => {this.handleDayChange(value,5)}} name="Friday" />}
                            label="Friday"
                          />
                          <FormControlLabel
                            control={<Checkbox checked={formData.days[6]} onChange={(e, value) => {this.handleDayChange(value,6)}} name="Saturday" />}
                            label="Saturday"
                          />
                          <FormControlLabel
                            control={<Checkbox checked={formData.days[0]} onChange={(e, value) => {this.handleDayChange(value,0)}} name="Sunday" />}
                            label="Sunday"
                          />
                        </FormGroup>
                      </FormControl>
                    </Grid>
                  }
                  <Grid item xs={12} sm={12}>
                    <form noValidate autoComplete="off">
                      <TextField fullWidth id="notes" label="Notes" variant="outlined" onChange={(value) => {this.handleNotesChange(value)}} />
                    </form>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Create Event
                </Button>
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
