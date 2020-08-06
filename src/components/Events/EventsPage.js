import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import { withAuthorization } from '../Session';
import { EventList } from '../Events';

import Footer from '../Footer';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import EventIcon from '@material-ui/icons/Event';
import StorefrontIcon from '@material-ui/icons/Storefront';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

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

function EventsPage(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    if((!loading && !loaded) || (vendor && props.authUser.vendor !== vendor.uid)) {
      console.log('loading name')
      setLoading(true);
      props.firebase
        .vendor(props.authUser.vendor)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setVendor({ ...doc.data(), uid: doc.id });
          } else {
            // doc.data() will be undefined in this case
            console.log("No such vendor!");
          }
          setLoaded(true);
          setLoading(false);
        }).catch(function(error) {
          console.log("Error getting vendor name:", error);
        });
    }    
  }, [props]);

  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.appBarSpacer} />
      <main>
        <Container className={classes.section} maxWidth="md">
          <Typography component="h1" variant="h3" align="center" color="textPrimary">
            Manage Events
          </Typography>
          {vendor &&
            <Typography component="h2" variant="h5" align="center" gutterBottom>
              {vendor.name} 
            </Typography>
          }
          {vendor && props.authUser.roles[ROLES.ADMIN] &&
            <Typography component="p" variant="p" align="center" gutterBottom>
              New User link: <Link href={'https://foodfinder.app/signup?vendor='+vendor.uid} target="_blank">{'https://foodfinder.app/signup?vendor='+vendor.uid}</Link> 
            </Typography>
          }
          <div className={classes.buttonGroup}>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <Button variant="contained" color="primary"
                  onClick={() => { props.history.push(ROUTES.EVENT_NEW) }}
                  startIcon={<EventIcon />}
                >
                  Add New Event
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary"
                  onClick={() => { props.history.push('/vendor/edit/' + props.authUser.vendor) }}
                  startIcon={<StorefrontIcon />}
                >
                  Edit Food Stand
                </Button>
              </Grid>
              {props.authUser.roles[ROLES.ADMIN] &&
                <Grid item>
                  <Button variant="outlined" color="secondary"
                    onClick={() => { props.history.push(ROUTES.VENDOR_NEW) }}
                    startIcon={<StorefrontIcon />}
                  >
                    New Food Stand
                  </Button>
                </Grid>
              }
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
