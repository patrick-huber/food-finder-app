import React, { setState } from 'react';
import { compose } from 'recompose';

import { Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import { withAuthorization, withEmailVerification } from '../Session';
import { EventList } from '../Events';

import Footer from '../Footer';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import RoomIcon from '@material-ui/icons/Room';
import FacebookIcon from '@material-ui/icons/Facebook';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  buttonGroup: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  section: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paperCallout: {
    marginTop: 30,
    marginBottom: 20,
    padding: 20,
  }
}));

const NewEventButton = () => (
  <Route render={({ history}) => (
    <Button variant="contained" color="primary"
      onClick={() => { history.push(ROUTES.EVENT_NEW) }}
    >
      Add New Event
    </Button>
  )} />
)


function EventsPage(props) {
  const classes = useStyles();

  if(props.location.state) {
    if(props.location.state.action && props.location.state.action) {
      alert(props.location.state.action);
      props.history.push({
        state: { action: null }
      });
    }
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.appBarSpacer} />
      <main>
        <Container className={classes.section} maxWidth="md">
          <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
            Events
          </Typography>
          <div className={classes.buttonGroup}>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <NewEventButton />
              </Grid>
            </Grid>
          </div>
          <Paper elevation={0} className={classes.paperCallout}>
            <EventList authUser={props.authUser} {...props} />
          </Paper>
        </Container>
      </main>
      <Footer />
    </React.Fragment>
  );
}

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(EventsPage);
