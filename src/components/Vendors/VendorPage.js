import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

import Footer from '../Footer';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
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
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  buttonLink: {
    textDecoration: 'none !important',
    color: 'inherit',
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  section: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    backgroundColor: theme.palette.primary.dark,
    color: '#ffffff',
  },
  paperCallout: {
    marginTop: 30,
    marginBottom: 20,
  }
}));


export default function VendorPage() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.appBarSpacer} />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Food Vendors
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Hungry people are trying to find you!
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSciifqS0CrTt5diM0WFnM1bSVFTUy1342pxWKmE07YfdS_sBQ/viewform?usp=sf_link')}>
                    Get Listed
                  </Button>
                </Grid>
                <Grid item>
                  <RouterLink className={classes.buttonLink} to={ROUTES.SIGN_IN}>
                    <Button variant="outlined" color="secondary">
                      Vendor Login
                    </Button>
                  </RouterLink>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            <Container>
              <Typography component="h2" variant="h3" align="center" color="textPrimary" gutterBottom>
                Thousands of hungry people are searching
              </Typography>
              <Typography component="p" align="center" paragraph>
                People from all across Minnesota are actively searching for YOUR food stand!
              </Typography>
              <Container maxWidth="sm">
                <Paper elevation={0} spacing={2} className={classes.paperCallout}>
                  <List
                    subheader={
                      <ListSubheader component="div" color="primary">
                        By the numbers
                      </ListSubheader>
                    }>
                    <ListItem>
                      <ListItemIcon>
                        <RoomIcon />
                      </ListItemIcon>
                      <ListItemText primary="1.3 Million views of the Food Finder map" />
                    </ListItem>
                    <ListItem
                      button
                      onClick={() => window.open('https://www.facebook.com/groups/245420266734458')}
                    >
                      <ListItemIcon>
                        <FacebookIcon />
                      </ListItemIcon>
                      <ListItemText primary="169K Members in Fair Food Finder Facebook group" />
                    </ListItem>
                    <ListItem
                      button
                      onClick={() => window.open('https://forms.gle/QddFymSXK9akxd7K6')}
                    >
                      <ListItemIcon>
                        <FormatListNumberedIcon />
                      </ListItemIcon>
                      <ListItemText primary="92% of users plan to visit a food vendor in next 30 days" secondary="of 780 responses to our survey" />
                    </ListItem>
                  </List>
                </Paper>
              </Container>
              <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSciifqS0CrTt5diM0WFnM1bSVFTUy1342pxWKmE07YfdS_sBQ/viewform?usp=sf_link')}>
                      Add Your Stand
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Container>
          </Grid>
        </Container>
        <div className={classes.section}>
          <Container maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              <Container>
                <Typography component="h2" variant="h3" align="center" gutterBottom>
                  Vendor Dashboard
                </Typography>
                <Typography component="p" align="center" paragraph>
                  The new Vendor Dashboard is live! It allows you to update your events and add new events to the Fair Food Finder app.
                </Typography>
                <Typography component="p" align="center" paragraph>
                  We're building out new features, including event insights and metrics. You'll be able to see things like: how many people see your events, get directions to a location, view your website or menu, and visit your social media pages.
                </Typography>
                <Typography component="h2" variant="h4" align="center" gutterBottom>
                  Get Signed Up
                </Typography>
                <Typography component="p" align="center" paragraph>
                  Fill out the <Link href="https://docs.google.com/forms/d/e/1FAIpQLSciifqS0CrTt5diM0WFnM1bSVFTUy1342pxWKmE07YfdS_sBQ/viewform?usp=sf_link" color="inherit">Vendor Signup form</Link> to get access to the Vendor Dashboard.
                </Typography>
                <div className={classes.heroButtons}>
                  <Grid container spacing={2} justify="center">
                    <Grid item>
                      <Button variant="contained" color="default" onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSciifqS0CrTt5diM0WFnM1bSVFTUy1342pxWKmE07YfdS_sBQ/viewform?usp=sf_link')}>
                        Vendor Signup Form
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </Container>
            </Grid>
          </Container>
        </div>
      </main>
      <Footer />
    </React.Fragment>
  );
}