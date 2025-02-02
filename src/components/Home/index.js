import React from 'react';
import { Route } from "react-router-dom";
import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';

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


function HomePage(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.appBarSpacer} />
      <main>
        <Container className={classes.section} maxWidth="sm">
          <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
            Vendor Portal
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Manage your events on the Fair Food Finder
          </Typography>
          <div className={classes.buttonGroup}>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <NewEventButton />
              </Grid>
            </Grid>
          </div>
        </Container>
        <Divider />
        <Container className={classes.section} maxWidth="sm">
          <Typography component="h2" variant="h4" align="center" color="textPrimary" gutterBottom>
            Your Events
          </Typography>
          <Paper elevation={0} spacing={2} className={classes.paperCallout}>
            <EventList />
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
)(HomePage);
