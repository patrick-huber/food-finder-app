import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class EventItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authUser, event } = this.props;

    return (
      <li>
        <span>
          <strong>{event.vendor}</strong> {event.address}
        </span>
        <Link
          to={{
            pathname: `${ROUTES.EVENTS}/edit/${event.uid}`,
            state: { event },
          }}
        >
          Edit
        </Link>
      </li>
    );
  }
}

export default EventItem;
