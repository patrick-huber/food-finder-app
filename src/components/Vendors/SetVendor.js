import React, { Component } from 'react';
import { compose } from 'recompose';

import * as ROUTES from '../../constants/routes';

import { withAuthorization } from '../Session';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

class SetVendor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      vendors: [],
      selectedVendor: { name: props.authUser.vendor, id: props.authUser.vendor },
    };
  }

  componentDidMount() {
    this.setState({loading: true});
    this.unsubscribe = this.props.firebase
      .vendors()
      .onSnapshot(snapshot => {
        let vendors = [];

        snapshot.forEach(vendor => {
          const vendorData = vendor.data();

          vendors.push({ ...vendorData, uid: vendor.id });
        }, err => {
          console.error('Unable to load vendors for SetVendor. Please try again later.')
        });

        this.setState({
          loading: false,
          vendors: vendors,
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  setValue = (val) => {
    this.setState({selectedVendor: val});
    this.updateUserFirestore(val.uid);
  }

  updateUserFirestore = (vendorId) => {
    this.props.firebase
      .user(this.props.authUser.uid)
      .update({
        vendor: vendorId,
      })
      .then(() => {
        this.props.history.push(ROUTES.EVENTS);
        window.location.reload(true);
      })
      .catch((error) => {
        alert("Error updating vender. Error details: " + error);
      });
  }

  render() {
    const { loading, vendors, selectedVendor } = this.state;
    const isAdmin = this.props.authUser.roles.ADMIN;

    return (
      <div>
        {isAdmin &&
          <Autocomplete
            loading={loading}
            disableClearable
            value={selectedVendor}
            options={vendors}
            getOptionLabel={(vendor) => vendor.name}
            onChange={(event, newValue) => {
              this.setValue(newValue);
            }}
            id="select-vendor"
            renderInput={(params) => <TextField {...params} label="Admin: Change Vendor" variant="outlined" />}
          />
        }
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
)(SetVendor);
