import React, { useState, useEffect, useRef } from 'react';

import { format, formatRelative, addDays } from 'date-fns';

import { withStyles } from '@material-ui/core/styles';

import { InfoWindow } from '../Map';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
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
  },
})(Typography);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function InfoWindowList(props) {
  const observedList = useRef(null);
  const vendors = props.infoData;
  const [selected, setSelected] = React.useState(null);
  const [height, setHeight] = React.useState(null); 
  const firebase = props.firebase;

  useEffect(() => {
    let newHeight = observedList.current.clientHeight === 0 ? 200 : observedList.current.clientHeight;
    let offset = height ? -(newHeight - height) : newHeight;

    props.onRender(offset); 
    setHeight(newHeight);
  }, [selected]);

  return (
    <Container disableGutters ref={observedList}>
      {!selected &&
      <div>
      <Title variant="h5" component="h2">
        Vendors at this location
      </Title>
      <Subtitle color="text.secondary" variant="caption" component="h3">
        {vendors[0].events[0].address}
      </Subtitle>

      <List>
        {vendors.map((vendor, id) => (
        <ListItem
          key={id}
          button
          onClick={() => {setSelected(vendors[id])}}
        >
          <ListItemText
            primary={vendor.info.title}
          />
        </ListItem>
        ))}
      </List>
      </div>
      }
      {selected &&
        <div>
          <IconButton size="small" color="inherit" onClick={() => {setSelected(null)}} aria-label="back to list of vendors">
            <ArrowBackIcon />
          </IconButton>
          <InfoWindow
            infoData={selected}
            firebase={firebase}
          />
        </div>
      }
    </Container>
  );
}
