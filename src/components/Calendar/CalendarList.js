import React from 'react';

import { format } from 'date-fns';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EventIcon from '@material-ui/icons/Event';

export default function CalendarList(props) {
  const calendar = props.calendar;

  return (
    <List>
    {calendar.map((event, id) => (
      <ListItem alignItems="flex-start" key={'list-'+id}>
        <ListItemIcon>
          <EventIcon color="primary" />
        </ListItemIcon>
        <ListItemText
          primary={event.recurring_start ? event.daysString : format(event.start_time.toDate(), 'EEEE, MMMM do')}
          secondaryTypographyProps={{component:'div'}}
          secondary={
            <React.Fragment>
              <div>{ format(event.start_time.toDate(), 'p')+ format(event.end_time.toDate(), ' - p') }</div>
              {event.additionalHours && (event.additionalHours.map((hour, index) => (
                <div key={index}>{ format(hour.start_time.toDate(), 'p')+ format(hour.end_time.toDate(), ' - p') }</div>
              )))}
              {event.recurring_end && (event.recurring_end.toMillis() <= (new Date().getTime() + (7 * 24 * 60 * 60 * 1000))) && // recurring end date is within next 7 days
                <div>
                  {'Through ' + format(event.recurring_end.toDate(), 'P')}
                </div>
              }
            </React.Fragment>
          }
        />
      </ListItem>
    ))}
    </List>
  );
}
