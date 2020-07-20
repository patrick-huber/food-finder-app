import React, { Component } from 'react';

import { styled } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Popover from '@material-ui/core/Popover';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import SearchIcon from '@material-ui/icons/Search';
import EventIcon from '@material-ui/icons/Event';

import { InfoWindow as InfoWindowVendor } from '../Map';

import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import Slide from '@material-ui/core/Slide';

import Search from '../Search';
import FormControl from '@material-ui/core/FormControl';
import AppBar from '@material-ui/core/AppBar';

import Filter from '../Filter';

import Snackbar from '@material-ui/core/Snackbar';

import { GoogleMap, LoadScript, InfoWindow, Marker } from '@react-google-maps/api';

import { Spinner } from '../Loading';

import { withFirebase } from '../Firebase';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const headerHeight = 48+20;
const ButtonGrid = styled(Grid)({
  position: 'absolute',
  top: headerHeight+15,
  textAlign: 'center',
});
const TopButton = styled(IconButton)({
  margin: '0 auto',
  display: 'block',
  backgroundColor: (props) =>
    props.selected
      ? '#2699FB'
      : '#ffffff',
  border: (props) =>
    props.selected
      ? '2px solid white'
      : '2px solid #2699FB',
  color: (props) =>
    props.selected
      ? 'white'
      : '#333333',
});
const ButtonText = styled(Typography)({
  color: (props) =>
    props.selected
      ? '#2699FB'
      : '#333333',
  fontWeight: 500,
  textShadow: '0 0 2px #ffffff, 0 0 5px #ffffff',
});

const DialogContainer = styled(Container)({
  padding: '0 30px',
});
const DialogToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const ActionsBar = styled(AppBar)({
  top: 'auto',
  bottom: 0,
  padding: '10px 30px',
  backgroundColor: '#ffffff',
});
const Actions = styled(Button)({
  margin: '6px 0',
});

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());

  date.setDate(date.getDate() + days);

  return date;
}
function getDaysInRange(startDate, endDate) {
  let days = [];
  let i = 0;
  const daysSelected = ((endDate - startDate) / 1000/60/60/24);

  if(daysSelected >= 7) days = [0,1,2,3,4,5,6];
  else if(daysSelected <= 1) days = [startDate.getDay()]
  else {
    do {
      days.push(startDate.addDays(i).getDay());
      i++;
    }
    while (i <= daysSelected);
  }

  return days;
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

function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null
}

const mapOptions = {
  mapContainerStyle : {
    height: '100vh',
    width: '100vw',
  },
  center: {
    lat: 44.9778,
    lng: -93.2650
  },
  zoom: 10,
  options: {
    maxZoom: 18.5,
    mapTypeControl: false,
    gestureHandling: 'greedy',
  }
}

const timeNow = new Date();
const calendarDefaults = {
  startTime: timeNow,
  endTime: timeNow.addDays(7),
}

class GMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      calendar: [],
      fullCalendar: [],
      loading: false,
      refresh: false,
      modalLoading: false,
      modalLoaded: false,
      modalOpen: false,
      filterModalOpen: false,
      filterSet: false,
      filteredHours: [0,24],
      filteredHoursToggle: 'any',
      filteredDates: [null,null],
      vendors: [],
      vendorFilteredCalendar: [],
      searchResults: [],
      locationLoading: false,
      infoLoading: false,
      infoData: {},
      selected: null,
      selectedVendor: null,
      mapRef: null,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase
      .calendar()
      // Todo: need to add some filters and limits if we get too many events
      .orderBy('start_time')
      .onSnapshot(snapshot => {
        let calendar = [];

        snapshot.forEach(doc =>
          calendar.push({ ...doc.data(), uid: doc.id }),
        );

        if(this.state.loading) {
          this.setNewBounds(calendar);
          this.setState({
            calendar,
            fullCalendar: calendar,
            loading: false,
          });
        } else {
          this.setState({
            refresh: true,
            fullCalendar: calendar,
          });
        }

      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  refreshMap = () => {
    this.setState({
      calendar: this.state.fullCalendar,
      refresh: false,
      filterSet: false,
      filteredHours: [0,24],
      filteredHoursToggle: 'any',
      filteredDates: [null,null],
      modalLoaded: false,
      vendors: [],
      vendorFilteredCalendar: [],
      searchResults: [],
      infoLoading: false,
      infoData: {},
      selected: null,
      selectedVendor: null,
    });
    this.setNewBounds(this.state.fullCalendar);
  }

  filterCalendarByVendor = (vendorId) => {
    // Filters calendar events for a specific vendor
    function filterByID(item) {
      if (item.vendor === vendorId) {
        return true
      } 
      return false;
    }
    const result = this.state.fullCalendar.filter(filterByID);

    if(this.state.filteredDates[0] || (this.state.filteredHours[0] !== 0 && this.state.filteredHours[1] !== 24)) {
      this.setState({
        vendorFilteredCalendar: result,
      }, () => this.filterCalendarByTime(this.state.filteredDates, this.state.filteredHours)); // Rerun date filters
    } else {
      this.setState({
        calendar: result,
        vendorFilteredCalendar: result,
      });

      this.setNewBounds(result);

      if(result.length === 1) {
        // Set selected marker to vendor if there is only one marker
        this.setSelected(result[0])
      } else if (result.length > 1) {
        // Check for all vendor events at same location
        let locations = []

        for (var i = result.length - 1; i >= 0; i--) {
          let locationString = result[i].latitude + ',' + result[i].longitude;
          if(locations.indexOf(locationString) === -1) locations.push(locationString);
        }
        if(locations.length === 1) {
          // Set selected marker to vendor if there is only one location
          this.setSelected(result[0])
        } else {
          // Multiple locations for the vendor; Don't set selected marker
          this.setSelected(null)
        }
      } else {
        alert('This vendor does not have any active events.');
      }
    }

  }

  filterCalendarByTime = (dates, hours) => {
    // Filters calendar events for specific dates and/or hours
    let dateResults = [];
    let filteredResults = [];
    const currentCalendar = this.state.selectedVendor ? this.state.vendorFilteredCalendar : this.state.fullCalendar;

    // Date filter
    if(dates[0]) {
      let i = 0;
      const startDateFilter = new Date(dates[0].getTime());
      const endDateFilter = (!dates[1]) ? startDateFilter : new Date(dates[1].getTime());
      const filterDays = getDaysInRange(startDateFilter, endDateFilter);

      for (i = currentCalendar.length - 1; i >= 0; i--) {
        if(currentCalendar[i].recurring) {
          // Check if some of event days are within filter range
          if(
            ((currentCalendar[i].recurring_start.toDate() >= startDateFilter) && (currentCalendar[i].recurring_start.toDate() <= endDateFilter)) ||
            ((currentCalendar[i].recurring_end.toDate() >=startDateFilter) && (currentCalendar[i].recurring_end.toDate() <= endDateFilter))) {
              // Filter recurring events by the days of the week selected in the date filter
              let r = 0;
              
              for (r = currentCalendar[i].days.length - 1; r >= 0; r--) {
                if(filterDays.includes(currentCalendar[i].days[r])) {
                  dateResults.push(currentCalendar[i]);
                  r = -1;
                } 
              }
          }
        } else {
           if(startDateFilter <= currentCalendar[i].end_time.toDate() && endDateFilter >= currentCalendar[i].start_time.toDate().addDays(-1)) {
            dateResults.push(currentCalendar[i]);
          }
        }
      }
    } else {
      dateResults = currentCalendar;
    }

    // Hours filter
    if(hours) {
      const tempCalendar = dateResults;
      let i = 0;

      for (i = tempCalendar.length - 1; i >= 0; i--) {
        const currentEvent = tempCalendar[i];
        const currentStartHour = currentEvent.start_time.toDate().getHours();
        const currentEndHour = currentEvent.end_time.toDate().getHours();

        if(hours[0] < currentEndHour && hours[1] > currentStartHour) {
          filteredResults.push(currentEvent);
        }
        // Check for additionalHours for this event
        if(currentEvent.additionalHours) {
          const additionalHours = currentEvent.additionalHours;
          let a = 0;

          for (a = additionalHours.length - 1; a >= 0; a--) {
            const currentStartHour = additionalHours[a].start_time.toDate().getHours();
            const currentEndHour = additionalHours[a].end_time.toDate().getHours();

            if(hours[0] < currentEndHour && hours[1] > currentStartHour) {
              filteredResults.push(currentEvent);
            }
          }
        }
      }
    } else {
      filteredResults = dateResults;
    }

    if(filteredResults.length === 0) alert('No events found matching your search.');
    if(filteredResults.length === 1) this.setSelected(filteredResults[0]);
    
    this.setState({calendar: filteredResults});
    this.setNewBounds(filteredResults);
  }

  getCalendarEventsAtLocation = (location) => {
    function filterByLocation(item) {
      if (item.location.latitude === location.latitude && item.location.longitude === location.longitude) {
        return true
      } 
      return false;
    }
    // Using current calendar with vendor search and fitlers applied
    return this.state.calendar.filter(filterByLocation);
  }

  isOpen = (event) => {
    let now = new Date();

    if(event.recurring) {
      return event.days.includes(now.getDay());
    } else {
      return (now < event.end_time.toDate() && now > event.start_time.toDate());
    }
  }

  setNewBounds = (markers) => {
    // Sets map bounds to contain markers
    const bounds = new window.google.maps.LatLngBounds();
    var i = markers.length - 1;

    for (i; i >= 0; i--) {
      bounds.extend({lat: markers[i].location.latitude, lng: markers[i].location.longitude});
    }

    this.state.mapRef.fitBounds(bounds);
  }

  setSelected = (marker) => {
    if(marker) {
      this.setState({
        infoLoading: true,
      });
      this.state.mapRef.panTo({ lat: marker.location.latitude, lng: marker.location.longitude });

      // Load vendor details into infoWindow
      const vendor = this.props.firebase
        .vendor(marker.vendor)
        .onSnapshot(vendor => {
          let vendorEvents = this.getCalendarEventsAtLocation(marker.location);
          let nextEventDays = '';
          let firstDay = true;
          let nextEvent = vendorEvents[0];

          if(nextEvent.recurring) {
            const today = new Date();
            const todayDay = today.getDay();
            const startDate = nextEvent.start_time.toDate();
            const startHour = startDate.getHours();
            const startMinutes = startDate.getMinutes();
            const endDate = nextEvent.end_time.toDate();
            const endHour = endDate.getHours();
            const endMinutes = endDate.getMinutes();
            let newStart = new Date();
            let newEnd = new Date();
            let checkDay = todayDay;
            let dateSet = false;

            // Set start_time and end_time of next recurring event (closest to today)
            // Go through event days array starting at index of todayDay
            do {
              let eventDay = (nextEvent.days.indexOf(checkDay) != -1) ? nextEvent.days[nextEvent.days.indexOf(checkDay)] : null;

              if((eventDay === todayDay) && ((today.getHours() + today.getMinutes()*.01) < (endHour + endMinutes*.01))) {
                // Happening today and hasn't ended yet - keep newStart and newEnd value of today
                dateSet = true;
              } else if(todayDay < eventDay) {
                // If recurring day is greater than today, add days for new event dates
                newStart = newStart.addDays(eventDay - todayDay)
                newEnd = newEnd.addDays(eventDay - todayDay);
                dateSet = true;
              }
              checkDay++;
            } while(checkDay < 7 && !dateSet);
            if(!dateSet) {
              // If recurring day is less than today, add 7 - today day value + recurring day value for next event day
              newStart = newStart.addDays(7 - todayDay + nextEvent.days[0]); // First recurring day in array is next event day
              newEnd = newEnd.addDays(7 - todayDay + nextEvent.days[0]);
            }

            newStart.setHours(startHour);
            newStart.setMinutes(startMinutes);
            nextEvent.start_time = new this.props.firebase.firestore.Timestamp.fromDate(newStart);
            newEnd.setHours(endHour);
            newEnd.setMinutes(endMinutes);
            nextEvent.end_time = new this.props.firebase.firestore.Timestamp.fromDate(newEnd);
            // Create plain text recurring days string
            nextEvent.days.map(day => {
              if(firstDay) {
                nextEventDays += getDayString(day) + 's';
                firstDay = false;
              } else {
                nextEventDays += ', ' + getDayString(day) + 's';
              }
            });
            nextEvent['daysString'] = nextEventDays;
          }

          this.setState({
            selected: marker,
            infoLoading: false,
            infoData: {
              title: vendor.data().name,
              address: nextEvent.address,
              phone: formatPhoneNumber(vendor.data().phone),
              isOpen: this.isOpen(nextEvent),
              nextEvent: nextEvent,
              events: vendorEvents,
            }
          });
        }, err => {
          console.log('No such vendor!');
        });
    } else {
      this.setState({
        selected: null,
      });
    }
  }

  onMapLoad = (map) => {
    this.setState({
      mapRef: map,
    });
  }

  onModalOpen = () => {
    this.setState({
      modalOpen: true,
    });

    if(!this.state.modalLoaded) {
      this.setState({ modalLoading: true });

      const vendorsFirestore = this.props.firebase
        .vendors()
        .orderBy('name')
        .get()
        .then(vendorsList => {
          let vendors = [];

          vendorsList.forEach(doc =>
            vendors.push({ ...doc.data(), uid: doc.id }),
          );

          this.setState({
            vendors,
            modalLoading: false,
            modalLoaded: true,
          });
        });
    }
  }
  onModalClose = () => {
    this.setState({
      modalOpen: false,
    });
  }

  onFilterModalOpen = () => {
    this.setState({
      filterModalOpen: true,
    });
  }
  onFilterModalClose = () => {
    this.setState({
      filterModalOpen: false,
    });
  }

  setFilters = (hours, toggle, dates) => {
    let filterStatus = false;
    if(dates[0] || (hours[0] !== 0 && hours[1] !== 24)) {
      filterStatus = true;
    }
    this.filterCalendarByTime(dates, hours);
    this.setState({
      filteredHours: hours,
      filteredHoursToggle: toggle,
      filteredDates: dates,
      filterSet: filterStatus,
      selected: null,
    });
    this.onFilterModalClose();
  }

  setSelectedVendor = (selected) => {
    if(!selected || selected === '') {
      this.setState({
        calendar: this.state.fullCalendar,
        vendorFilteredCalendar: [],
        selected: null,
        selectedVendor: null,
      }, () => {
        if(this.state.filteredDates[0] || (this.state.filteredHours[0] !== 0 && this.state.filteredHours[1] !== 24)) {
          // Rerun date filters
          this.filterCalendarByTime(this.state.filteredDates, this.state.filteredHours);
        } else {
          this.setNewBounds(this.state.calendar);
        }
      });
    } else {
      // Valid vendor selected
      this.setState({
        selected: null,
        selectedVendor: selected,
      }, () => this.filterCalendarByVendor(selected.uid));

      this.onModalClose();
    }
  }

  render() {
    const {
      calendar,
      fullCalendar,
      refresh,
      modalLoading,
      modalLoaded,
      modalOpen,
      filterModalOpen,
      filteredHoursToggle,
      filteredHours,
      filteredDates,
      filterSet,
      vendors,
      searchResults,
      loading,
      locationLoading,
      infoLoading,
      infoData,
      selected,
      selectedVendor,
      mapRef
    } = this.state;

    return (
      <div>
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API}
        >
          <GoogleMap
            id="Food-Finder-Map"
            mapContainerStyle={mapOptions.mapContainerStyle}
            zoom={mapOptions.zoom}
            options={mapOptions.options}
            center={mapOptions.center}
            onClick={() => {
              this.setSelected(null);
            }}
            onLoad={map => this.onMapLoad(map)}
          >
            {calendar.map((spot) => (
              <Marker
                key={spot.uid}
                position={{ lat: spot.location.latitude, lng: spot.location.longitude }}
                onClick={() => {
                  this.setSelected(spot);
                }}
              />
            ))}
            {selected ? (
              <InfoWindow
                position={{ lat: selected.location.latitude, lng: selected.location.longitude }}
                options={{pixelOffset: new window.google.maps.Size(0,-40)}}
                onCloseClick={() => {
                  this.setSelected(null);
                }}
              >
                <div>
                  {infoLoading
                    ? <Spinner />
                    : <InfoWindowVendor
                        infoData={infoData}
                        onRender={(height) => {this.state.mapRef.panBy(0, (-height/2 - headerHeight))}} />
                  }
                </div>
              </InfoWindow>
            ) : null}
          </GoogleMap>
        </LoadScript>
        <ButtonGrid container spacing={3}>
          <Grid item xs={4} selected>
            <TopButton
              selected={selectedVendor}
              type="button"
              onClick={this.onModalOpen}
              aria-label="Search"
            >
              <SearchIcon />
            </TopButton>
            <ButtonText selected={selectedVendor}>
            {selectedVendor ? selectedVendor.name : 'Search Vendors' }
            </ButtonText>
            <Dialog
              fullScreen
              open={modalOpen}
              onClose={this.onModalClose}
              aria-labelledby="modal-search-title"
              aria-describedby="modal-search-description"
              TransitionComponent={Transition}
            >
              <DialogToolbar>
                <IconButton edge="start" color="inherit" onClick={this.onModalClose} aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" id="modal-search-title">
                  Vendor Search
                </Typography>
                <IconButton edge="end" color="inherit" onClick={this.onModalClose} aria-label="close">
                  <DoneIcon />
                </IconButton>
              </DialogToolbar>
              {modalLoading
                ? <Spinner />
                : (
                  <DialogContainer>
                    <FormControl fullWidth>
                      <p id="modal-search-description">
                        Search for a vendor by name
                      </p>
                      <Search
                        options={vendors} currentValue={selectedVendor} onChange={(value) => {this.setSelectedVendor(value)}} />
                    </FormControl>
                    <ActionsBar position="fixed" color="primary">
                      <Actions onClick={this.onModalClose} fullWidth variant="contained" color="primary">
                        Find Vendor
                      </Actions>
                      <Actions onClick={() => {this.onModalClose(); this.setSelectedVendor(null);} } fullWidth>
                        Clear Search
                      </Actions>
                    </ActionsBar>
                  </DialogContainer>
                  )
              }
            </Dialog>
          </Grid>
          <Grid item xs={4}>
            <TopButton
              selected={filterSet}
              type="button"
              onClick={this.onFilterModalOpen}
              aria-label="Filter by date or time"
            >
              <EventIcon />
            </TopButton>
            <ButtonText selected={filterSet}>
            {filterSet ? 'Filter Applied' : 'Filter by Hours or Days' }
            </ButtonText>
            <Dialog
              fullScreen
              open={filterModalOpen}
              onClose={this.onFilterModalClose}
              aria-labelledby="modal-filter-title"
              TransitionComponent={Transition}
            >
              <Filter values={{filteredHours,filteredHoursToggle,filteredDates}} onChange={(hours, toggle, dates) => {this.setFilters(hours, toggle, dates)}}  />
            </Dialog>
          </Grid>
          <Grid item xs={4}>
            <TopButton
              selected={locationLoading}
              onClick={() => {
                this.props.firebase.analytics.logEvent('location_detect');
                this.setState({
                  locationLoading: true,
                })
                navigator.geolocation.getCurrentPosition(
                  (position) => {

                    this.props.firebase.analytics.logEvent('location_found', { position: position});
                    this.setState({
                      locationLoading: false,
                    });
                    mapRef.panTo({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    });
                    mapRef.setZoom(15);
                  },
                  () => {
                    this.setState({
                      locationLoading: false,
                    })
                    alert('We were unable to find your current location.');
                  }
                );
              }}
              aria-label="Find my location"
            >
              {locationLoading  ? (
                <Spinner color='#ffffff' />
                ) : (
                <MyLocationIcon />
                )
              }
            </TopButton>
            <ButtonText selected={locationLoading}>
            {locationLoading ? 'Finding Location...' : 'Find My Location' }
            </ButtonText>
          </Grid>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={refresh}
            message="Map updated. Please refresh to see latest info."
            action={
              <React.Fragment>
                <Button color="secondary" size="small" onClick={this.refreshMap}>
                  Refresh Map
                </Button>
              </React.Fragment>
            }
          />
        </ButtonGrid>
      </div>
    )
  }
}

export default withFirebase(GMap);
