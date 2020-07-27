import React, { Component } from 'react';
import { compose } from 'recompose';

import * as ROLES from '../../constants/roles';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import EventList from './EventList';
import { Spinner } from '../Loading';

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    backgroundColor: "red"
  },
});

class Events extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: false,
      events: [],
    };
  }

  componentDidMount() {
    const vendor = this.props.authUser.vendor;

    this.unsubscribe = this.props.firebase
      .calendar()
      .where('vendor', '==', vendor)
      .onSnapshot(snapshot => {
        let events = [];
        
        if(snapshot.size) {
          snapshot.forEach(doc => {
            events.push({ ...doc.data(), uid: doc.id });
            this.setState({
              events: events,
              loading: false,
            });
          }, err => {
            alert('Unable to load events. Please try again later.')
            console.log('error')
            this.setState({
              loading: false,
            });
          });
        } else {
          this.setState({ events: null, loading: false });
        }

      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { text, events, loading } = this.state;

    return (
      <div>
        { loading &&
          <Spinner />
        }
        {events &&
          <EventList
            authUser={this.props.authUser}
            events={events}
          />
        }
        {!events && <div>There are no events ...</div>}
      </div>
    );
  }
}

const Auth = (firebase) => (
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? (
          <Events {...firebase} authUser={authUser} />
        ) : (
          <div>Unable to load current user</div>
        )
      }
    </AuthUserContext.Consumer>
);

export default compose(
  withStyles(styles, { withTheme: true }),
  withFirebase,
)(Events);
