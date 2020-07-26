import React, { Component } from 'react';

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
        <span>
          <button onClick={this.onToggleEditMode}>Edit</button>
        </span>
      </li>
    );
  }
}

export default EventItem;
