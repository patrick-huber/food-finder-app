import React from 'react';

import Footer from '../Footer';


import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import LanguageIcon from '@material-ui/icons/Language';

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}));

export default function Support() {
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
              Support &amp; Contact
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Having issues using the app or see something incorrect?
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => window.open('https://forms.gle/ukuRtXs5M7nS2JVPA')}>
                    Contact Support
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="secondary" onClick={() => window.open('https://forms.gle/14XSLARoKh9CBYB8A')}>
                    Report Bad Info
                  </Button>
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
                Contact
              </Typography>
              <Typography component="p" gutterBottom>
                If you would like to contact the team behind the Fair Food Finder app (currently a team of 1) please send a note.
              </Typography>
              <List
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Patrick Huber - Creator & Founder
                  </ListSubheader>
                }>
                <ListItem
                  button
                  onClick={() => window.open('mailto:patrick.huber1@gmail.com')}
                >
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Patrick.Huber1@gmail.com" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => window.open('tel:952-215-6386')}
                >
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText primary="952-215-6386" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => window.open('https://patrickhuber.me')}
                >
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText primary="https://patrickhuber.me" />
                </ListItem>
              </List>
            </Container>
          </Grid>
        </Container>
      </main>
      <Footer />
    </React.Fragment>
  );
}