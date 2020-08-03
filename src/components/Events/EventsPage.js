import React from 'react';
import { compose } from 'recompose';

import { Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import { withAuthorization } from '../Session';
import { EventList } from '../Events';

import Footer from '../Footer';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  buttonGroup: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
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

  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.appBarSpacer} />
      <main>
        <Container className={classes.section} maxWidth="md">
          <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
            {props.authUser.vendor} Events
          </Typography>
          <div className={classes.buttonGroup}>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <NewEventButton />
              </Grid>
            </Grid>
          </div>
          <EventList authUser={props.authUser} {...props} />
        </Container>
      </main>
      <Footer />
    </React.Fragment>
  );
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
)(EventsPage);
