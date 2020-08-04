import React, { useEffect, useRef } from 'react';

import { format, formatRelative } from 'date-fns';

import { withStyles } from '@material-ui/core/styles';

import { InfoWindow } from '../Map';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Container from '@material-ui/core/Container';

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
      <Subtitle variant="caption" component="h3">
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
            secondary={(vendor.events[0].isOpen ? 'Open now until ' + format(vendor.events[0].end_time.toDate(), 'p')   : ('Opens ' + formatRelative(vendor.events[0].start_time.toDate(), new Date()))) }
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
