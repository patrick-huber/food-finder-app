import React, { Component, setState } from 'react';
import { compose } from 'recompose';

import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';

import EventList from './EventList';

import { Spinner } from '../Loading';

import MUIDataTable from "mui-datatables";

import { format } from 'date-fns';

import Container from '@material-ui/core/Container';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Chip from '@material-ui/core/Chip';

import Link from '@material-ui/core/Link';

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    backgroundColor: "red"
  },
  dataTable: {
    // backgroundColor: theme.palette.primary.light,
  },
  daysChip: {
    margin: 2,
  },
  centerText: {
    textAlign: 'center',
  },
});

class ActionsMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      index: props.index,
    };
  };

  handleClick = (event) => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleClose = (action) => {
    if(action) {
      this.props.selectAction(this.state.index, action);
    }
    this.setState({anchorEl: null});
  };

  render() {
    const { anchorEl, index } = this.state;
    return (
      <div>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={(event) => {this.handleClick(event)}}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id={`"actions-${index}"`}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClick={() => {this.handleClose()}}
        >
          <MenuItem onClick={() => {this.handleClose('Edit')}}>Edit</MenuItem>
          <MenuItem onClick={() => {this.handleClose('Delete')}}>Delete</MenuItem>
        </Menu>
      </div>
    )
  }
}

function getDayString(dayValue) {
  let weekday=new Array(7);
  weekday[0]="Sunday";
  weekday[1]="Monday";
  weekday[2]="Tuesday";
  weekday[3]="Wednesday";
  weekday[4]="Thursday";
  weekday[5]="Friday";
  weekday[6]="Saturday";

  return weekday[dayValue];
}
function convertDaysArrayToString(daysArray) {
  let firstDay = true;
  var daysString = '';

  daysArray.map(day => {
    if(firstDay) {
      daysString += getDayString(day) + 's';
      firstDay = false;
    } else {
      daysString += ', ' + getDayString(day) + 's';
    }
  });
  return daysString;
}
function convertDaysValuesToStrings(daysArray) {
  var daysStringArray = [];

  daysArray.map(day => {
    daysStringArray.push(getDayString(day));
  });

  return daysStringArray;
}

class EventsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: false,
      events: [],
      tableData: [],
    };
  }

  componentDidMount() {
    const vendor = this.props.authUser.vendor;
    this.setState({
      loading: true,
    });

    this.unsubscribe = this.props.firebase
      .calendar()
      .where('vendor', '==', vendor)
      .onSnapshot(snapshot => {
        if(snapshot.size) {
          let events = [];
          let tableData = [];

          snapshot.forEach(doc => {
            events.push({ ...doc.data(), uid: doc.id });

            const recurring_end = doc.data().recurring_end ? format(doc.data().recurring_end.toDate(), 'P') : null;
            const days = doc.data().days ? convertDaysValuesToStrings(doc.data().days) : null;

            tableData.push({
              address: doc.data().address,
              date: format(doc.data().start_time.toDate(), 'P'),
              open: format(doc.data().start_time.toDate(), 'p'),
              close: format(doc.data().end_time.toDate(), 'p'),
              recurring_end: recurring_end,
              days: days,
              uid: doc.id,
            });
          }, err => {
            alert('Unable to load events. Please try again later.')
            console.log('error')
            this.setState({
              loading: false,
            });
          });

          this.setState({
            events: events,
            tableData: tableData,
            loading: false,
          });
        } else {
          this.setState({ events: null, loading: false });
        }

      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  deleteEvent = (eventId) => {
    this.props.firebase
      .calendarDetails(eventId)
      .delete()
      .then(() => {
        console.log("Document deleted.");
      })
      .catch((error) => {
        alert("Error deleting event. Please reach out to support with these error details: " + error);
      });
  }

  onActionSelect = (eventId, action) => {
    if(action === 'Edit') {
      this.props.history.push('/events/edit/' + eventId);
    } else if(action === 'Delete') {
      const confirmation = window.confirm('Are you sure you want to delete this event?');
      if(confirmation) this.deleteEvent(eventId);
    }
  }

  render() {
    const { text, events, tableData, loading } = this.state;
    const { classes } = this.props;
    const columns = [
     {
      name: "date",
      label: "Date",
      options: {
        filter: true,
        sort: true,
      }
     },
     {
      name: "open",
      label: "Opening Time",
      options: {
        filter: true,
        sort: true,
      }
     },
     {
      name: "close",
      label: "Closing Time",
      options: {
        filter: true,
        sort: true,
      }
     },
     {
      name: "address",
      label: "Location",
      options: {
        filter: true,
        sort: true,
      }
     },
     {
      name: "days",
      label: "Days",
      options: {
        filter: true,
        filterType: 'multiselect',
        filterOptions: {
          names: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        customBodyRenderLite: (dataIndex) => {
          let value = tableData[dataIndex].days ? tableData[dataIndex].days : [];
          return value.map( (val, key) => {
            return <Chip className={classes.daysChip} label={val} key={key} />;
          });
        },
        sort: false,
      }
     },
     {
      name: "recurring_end",
      label: "Recurring End",
      options: {
        filter: true,
        sort: true,
      }
     },
     {
      name: "",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => {
          return (
            <ActionsMenu index={dataIndex} selectAction={(dataIndex, action) => {this.onActionSelect(tableData[dataIndex].uid, action)}} />
          )
        }
      }
     }
    ];
    const options = {
      selectableRows: 'none',
    };

    return (
      <div>
        { loading &&
          <div className={classes.centerText}>
            <Spinner />
          </div>
        }
        {events && !loading &&
          <MUIDataTable
            className={classes.dataTable}
            title={"Events List"}
            data={tableData}
            columns={columns}
            options={options}
          />
        }
        {!events &&
          <Container className={classes.centerText}>
            There are no events.
            <Link href="#" color="primary" onClick={(e) => { e.preventDefault(); this.props.history.push(ROUTES.EVENT_NEW); }}> Add a new event now!</Link>
          </Container>
        }
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withStyles(styles, { withTheme: true }),
  withAuthorization(condition),
)(EventsList);
