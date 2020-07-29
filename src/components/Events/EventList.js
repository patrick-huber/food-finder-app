import React from 'react';

import EventItem from './EventItem';

const EventList = ({
  authUser,
  events,
}) => (
  <ul>
    {events && events.map(event => (
      <EventItem
        authUser={authUser}
        key={event.uid}
        event={event}
      />
    ))}
  </ul>
);

export default EventList;
