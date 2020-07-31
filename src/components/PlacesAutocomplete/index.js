import React from 'react';

import { LoadScript } from '@react-google-maps/api';

import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';

const libraries = ['places'];
const autocompleteService = { current: null };
const geocoder = { current: null };

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  editGeoContainer: {
    marginTop: -12,
    marginLeft: 8,
  },
  editGeoIcon : {
    fontSize: '0.8rem',
    verticalAlign: 'top',
  }
}));

export default function GoogleMaps(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(null);
  // Todo: If geolocation coordinates are set manually then we should remove place_id.
  // work on this once a map is embedded into the EditEvent page and it's easier to move a pin to select geolocation
  const [geoValue, setGeoValue] = React.useState(null);
  const [placeId, setPlaceId] = React.useState(null);
  const [geoEdit, setGeoEdit] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    setValue(props.defaultValue.address);
    setGeoValue(props.defaultValue.location);
  },[props.defaultValue]);

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    [],
  );

  function handleOnChange(newValue) {
    // Set autocomplete UI 
    setOptions(newValue ? [newValue, ...options] : options);

    if(newValue) {
      setValue(newValue);
      setPlaceId(newValue.place_id);
      // get geolocation and set form value
      if (!geocoder.current && window.google) {
        geocoder.current = new window.google.maps.Geocoder();
      }

      geocoder.current.geocode({placeId: newValue.place_id}, (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            setGeoValue(results[0].geometry.location.toJSON());
          } else {
            window.alert("Unable to find geolocation. Please enter manually.");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      });
    }
  }

  React.useEffect(() => {
    if(value && geoValue) props.valueChange(value, geoValue, placeId);
  },[value, geoValue]);

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API}
      libraries={libraries}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            id="google-map-demo"
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            noOptionsText="Search for a location"
            onChange={(event, newValue) => {
              handleOnChange(newValue);
            }}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} required label="Address" variant="outlined" fullWidth />
            )}
            renderOption={(option) => {
              const matches = option.structured_formatting.main_text_matched_substrings;
              const parts = parse(
                option.structured_formatting.main_text,
                matches.map((match) => [match.offset, match.offset + match.length]),
              );

              return (
                <Grid container alignItems="center">
                  <Grid item>
                    <LocationOnIcon className={classes.icon} />
                  </Grid>
                  <Grid item xs>
                    {parts.map((part, index) => (
                      <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                        {part.text}
                      </span>
                    ))}

                    <Typography variant="body2" color="textSecondary">
                      {option.structured_formatting.secondary_text}
                    </Typography>
                  </Grid>
                </Grid>
              );
            }}
          />
        </Grid>
        {geoEdit &&
          <React.Fragment>
            <Grid item xs={6}>
              <TextField
                id="geolocation-latitude"
                label="Latitude"
                variant="outlined" 
                value={geoValue.lat}
                onChange={(e) => {setGeoValue({...geoValue, lat: Number(e.target.value)})}}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="geolocation-longitude"
                label="Longitude"
                variant="outlined"
                value={geoValue.lng}
                onChange={(e) => {setGeoValue({...geoValue, lng: Number(e.target.value)})}}
              />
            </Grid>
          </React.Fragment>
        }
        {geoValue &&
          <Grid item xs={12} className={classes.editGeoContainer}>
            <Link href={'https://www.google.com/maps/search/'+geoValue.lat+','+geoValue.lng} target="_blank" rel="noreferrer" variant="caption" component="a">
              {geoValue.lat + ', ' + geoValue.lng}
            </Link>
            {!geoEdit &&
              <IconButton aria-label="edit geolocation coordinates" size="small" className={classes.editGeoIcon} onClick={() => setGeoEdit(true)}>
                <EditIcon fontSize="inherit" />
              </IconButton>
            }
          </Grid>
        }
      </Grid>
    </LoadScript>
  );
}
