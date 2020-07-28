import React, { Component } from 'react';
import { compose } from 'recompose';

import * as ROLES from '../../constants/roles';
import { AuthUserContext } from '../Session';
import { withAuthorization } from '../Session';

import EventList from './EventList';

import { Spinner } from '../Loading';

import MUIDataTable from "mui-datatables";

import { format } from 'date-fns';

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    backgroundColor: "red"
  },
});

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
  name: "address",
  label: "Location",
  options: {
   filter: true,
   sort: true,
  }
 },
];
const options = {
};

class Events extends Component {
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

    this.unsubscribe = this.props.firebase
      .calendar()
      .where('vendor', '==', vendor)
      .onSnapshot(snapshot => {
        if(snapshot.size) {
          let events = [];
          let tableData = [];

          snapshot.forEach(doc => {
            events.push({ ...doc.data(), uid: doc.id });
            tableData.push({
              address: doc.data().address,
              date: format(doc.data().start_time.toDate(), 'PPPPpp'),
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

  render() {
    const { text, events, tableData, loading } = this.state;

    return (
      <div>
        { loading &&
          <Spinner />
        }
        {events &&
          <MUIDataTable
            title={"Events List"}
            data={tableData}
            columns={columns}
            options={options}
          />
        }
        {!events && <div>There are no events ...</div>}
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withStyles(styles, { withTheme: true }),
  withAuthorization(condition),
)(Events);
