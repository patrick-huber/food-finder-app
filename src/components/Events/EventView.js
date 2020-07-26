import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import RoomIcon from '@material-ui/icons/Room';
import FacebookIcon from '@material-ui/icons/Facebook';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import Link from '@material-ui/core/Link';
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    backgroundColor: "red"
  }
});

class EventView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      event: null,
      ...props.location.state,
    };
  }

  componentDidMount() {
    if (this.state.event) {
      return;
    }

    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase
      .calendarDetails(this.props.match.params.id)
      .onSnapshot(snapshot => {
        this.setState({
          event: snapshot.data(),
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  render() {
    const { event, loading } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <h2>Event ({this.props.match.params.id})</h2>
        {loading && <div>Loading ...</div>}

        {event && (
          <div>
            <span>
              <strong>Address:</strong> {event.address}
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withFirebase,
)(EventView);
