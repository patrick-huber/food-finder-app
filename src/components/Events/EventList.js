import React from 'react';

import EventItem from './EventItem';

const EventList = ({
  authUser,
  events,
  onEditEvent,
}) => (
  <ul>
    {events && events.map(event => (
      <EventItem
        authUser={authUser}
        key={event.uid}
        event={event}
        onEditEvent={onEditEvent}
      />
    ))}
  </ul>
);

export default EventList;
