import React, { useState, useEffect, useRef } from 'react';

import { format, formatRelative, addDays } from 'date-fns';

import { withStyles } from '@material-ui/core/styles';

import { CalendarList } from '../Calendar';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import DirectionsIcon from '@material-ui/icons/Directions';
import PhoneIcon from '@material-ui/icons/Phone';
import LanguageIcon from '@material-ui/icons/Language';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import ScheduleIcon from '@material-ui/icons/Schedule';
import EventIcon from '@material-ui/icons/Event';

import Dialog from '@material-ui/core/Dialog';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';

const Title = withStyles({
  root: {
    marginLeft: 4,
    marginRight: 16, // For infowindow close
    textTransform: 'uppercase',
    fontWeight: 500,
    fontSize: '1.4rem',
    color: '#2699FB',
    textShadow: '1px 1px 2px #eee',
  },
})(Typography);

const Subtitle = withStyles({
  root: {
    marginLeft: 4,
    color: '#aaa',
    lineHeight: 1.2,
  },
})(Typography);

const CompactListItem = withStyles({
  root: {
    padding: '2px 4px',
  },
})(ListItem);

const CompactListItemIcon = withStyles({
  root: {
    minWidth: 32,
    marginTop: 5,
    color: '#2699FB',
  },
})(ListItemIcon);

const ListItemTextCenter = withStyles({
  root: {
    textAlign: 'center',
  },
})(ListItemText);

const SocialIconButton = withStyles({
  root: {
    color: '#2699FB',
  },
})(IconButton);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function InfoWindow(props) {
  const observed = useRef(null);
  const vendorData = props.infoData;
  const [modalOpen, setModalOpen] = useState(false);
  const firebase = props.firebase;

  useEffect(() => {
    if(props.onRender) {
      props.onRender((observed.current.clientHeight === 0) ? 350 : observed.current.clientHeight); // Todo: first render isn't firing correctly. Need to fix then remove this conditional statement
    }    
  }, [observed]);

  function openDirections(location) {
    firebase.analytics.logEvent('get_directions', {
      location_id: vendorData.events[0].uid,
      location_address: vendorData.events[0].address,
      vendor_id: vendorData.events[0].vendor,
      vendor: vendorData.info.title,
    });

    // Opens google maps directions in new window with specified location as the endpoint
    window.open('https://www.google.com/maps/dir/?api=1&destination='+location.latitude+','+location.longitude);
  }

  function callPhone(number) {
    firebase.analytics.logEvent('call_number', {
      location_id: vendorData.events[0].uid,
      location_address: vendorData.events[0].address,
      vendor_id: vendorData.events[0].vendor,
      vendor: vendorData.info.title,
      phone: number,
    });

    window.open('tel:' + number);
  }

  function openWebsite(link) {
    firebase.analytics.logEvent('view_website', {
      location_id: vendorData.events[0].uid,
      location_address: vendorData.events[0].address,
      vendor_id: vendorData.events[0].vendor,
      vendor: vendorData.info.title,
      website: link,
    });

    window.open(link);
  }

  function openMenu(link) {
    firebase.analytics.logEvent('view_menu', {
      location_id: vendorData.events[0].uid,
      location_address: vendorData.events[0].address,
      vendor_id: vendorData.events[0].vendor,
      vendor: vendorData.info.title,
      menu: link,
    });

    window.open(link);
  }

  function openSocial(platform, url) {
    firebase.analytics.logEvent(('visit_'+platform), {
      location_id: vendorData.events[0].uid,
      location_address: vendorData.events[0].address,
      vendor_id: vendorData.events[0].vendor,
      vendor: vendorData.info.title,
      url: url,
    });

    window.open(url);
  }

  return (
    <Container disableGutters ref={observed}>
      <Title variant="h5" component="h2">
        {vendorData.info.title}
      </Title>
      {vendorData.info.description &&
        <Subtitle variant="caption" component="p">
          {vendorData.info.description}
        </Subtitle>
      }
      <Grid container>
        <Grid item xs>
          <List>
            <CompactListItem alignItems={'flex-start'} key="address" button onClick={() => openDirections(vendorData.events[0].location)}>
              <CompactListItemIcon>
                <DirectionsIcon />
              </CompactListItemIcon>
              <ListItemText
                primary={vendorData.events[0].address}
                secondary={vendorData.events[0].notes}
              />
            </CompactListItem>
            {vendorData.info.phone &&
              <CompactListItem alignItems={'flex-start'} key="phone" button onClick={() => callPhone(vendorData.info.phone)}>
                <CompactListItemIcon>
                  <PhoneIcon />
                </CompactListItemIcon>
                <ListItemText primary={vendorData.info.phone} />
              </CompactListItem>
            }
            {vendorData.info.website &&
              <CompactListItem alignItems={'flex-start'} key="website" button onClick={() => openWebsite(vendorData.info.website)}>
                <CompactListItemIcon>
                  <LanguageIcon />
                </CompactListItemIcon>
                <ListItemText primary="Visit website" />
              </CompactListItem>
            }{vendorData.info.menu &&
              <CompactListItem alignItems={'flex-start'} key="menu" button onClick={() => openMenu(vendorData.info.menu)}>
                <CompactListItemIcon>
                  <RestaurantMenuIcon />
                </CompactListItemIcon>
                <ListItemText primary="View menu" />
              </CompactListItem>
            }
            <CompactListItem alignItems={'flex-start'} key="open">
              <CompactListItemIcon>
                <ScheduleIcon />
              </CompactListItemIcon>
              <ListItemText
                primary={vendorData.events[0].isOpen ? 'Open now' : 'Closed'}
                secondary={(vendorData.events[0].isOpen ? (format(vendorData.events[0].start_time.toDate(), 'p') + format(vendorData.events[0].end_time.toDate(), ' - p')) : ('Opens ' + formatRelative(vendorData.events[0].start_time.toDate(), new Date()))) }
                className={vendorData.events[0].isOpen ? 'text-open' : 'text-closed'}
              />
            </CompactListItem>
            <CompactListItem alignItems={'flex-start'} key="hours">
              <CompactListItemIcon>
                <EventIcon />
              </CompactListItemIcon>
              <ListItemText
                primary={vendorData.events[0].recurring_start ? vendorData.events[0].daysString : format(vendorData.events[0].start_time.toDate(), 'EEEE, MMMM do')}
                secondaryTypographyProps={{component:'div'}}
                secondary={
                  <React.Fragment>
                    <div>
                    {
                      format(vendorData.events[0].start_time.toDate(), 'p')+ format(vendorData.events[0].end_time.toDate(), ' - p')
                    }
                    </div>
                    {vendorData.events[0].additionalHours && (vendorData.events[0].additionalHours.map((hour, index) => (
                      <div key={index}>{ format(hour.start_time.toDate(), 'p')+ format(hour.end_time.toDate(), ' - p') }</div>
                    )))}
                    {vendorData.events[0].recurring_end && (vendorData.events[0].recurring_end.toMillis() <= (new Date().getTime() + (7 * 24 * 60 * 60 * 1000))) && // recurring end date is within next 7 days
                      <div>
                        {'Last day ' + format(addDays(vendorData.events[0].recurring_end.toDate(), -1), 'P')}
                      </div>
                    }
                  </React.Fragment>
                }
              />
            </CompactListItem>
          </List>
        </Grid>
        {(vendorData.info.photo || vendorData.info.instagram || vendorData.info.facebook) &&
          <Grid item xs={4} style={{marginTop: 8, textAlign: 'center'}}>
            {vendorData.info.photo &&
              <img src={vendorData.info.photo} alt="Vendor" style={{width:'100%'}} />
            }
            <Grid container justify="space-evenly" spacing={1}>
              {vendorData.info.instagram &&
                <Grid item xs>
                  <SocialIconButton size="small" onClick={() => openSocial('instagram', 'https://www.instagram.com/'+vendorData.info.instagram)} aria-label="Instagram">
                    <InstagramIcon />
                  </SocialIconButton>
                </Grid>
              }
              {vendorData.info.facebook &&
                <Grid item xs>
                  <SocialIconButton size="small" onClick={() => openSocial('facebook', 'https://www.facebook.com/'+vendorData.info.facebook)} aria-label="Facebook">
                    <FacebookIcon />
                  </SocialIconButton>
                </Grid>
              }
            </Grid>
          </Grid>
        }
      </Grid>
      {vendorData.events.length > 1 &&
        <List>
          <CompactListItem
            key="calendar"
            button
            onClick={() => setModalOpen(true)}>
              <ListItemTextCenter
                primary={(vendorData.events.length-1) + ' other time' + ((vendorData.events.length-1 === 1) ? '' : 's') + ' at this location'}
                secondary='View all dates and times'
              />
            </CompactListItem>
            <Dialog
              fullScreen
              open={modalOpen}
              TransitionComponent={Transition}
              aria-labelledby="modal-calendar-title"
            >
              <Container>
                <Toolbar>
                  <IconButton edge="start" color="inherit" onClick={() => setModalOpen(false)} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6" id="modal-calendar-title">
                    All dates and times at this location
                  </Typography>
                </Toolbar>
                <CalendarList calendar={vendorData.events} />
                <Button
                  onClick={() => setModalOpen(false)}
                  fullWidth>
                  Back to Map
                </Button>
              </Container>
            </Dialog>
        </List>
      }
    </Container>
  );
}
