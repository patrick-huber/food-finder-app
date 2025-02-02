/* eslint-disable no-use-before-define */
import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const SearchAutocomplete = withStyles({
  root: {
    '& .MuiFormControl-root': {
      margin: 0,
    }
  },
})(Autocomplete);
const ResultsContainer = withStyles({
  root: {
    padding: 0,
    zIndex: 0,
  },
})(Container);
const ListboxContainer = withStyles({
  root: {
    padding: 0,
    maxHeight: '60vh',
  }
})(List);

export default function VendorSearch(props) {
  const options = props.options;
  const [value, setValue] = React.useState(props.currentValue);

  function handleChange(event, newValue) {
    setValue(newValue);
    props.onChange(newValue);
  }
  function handleInputChange(event, newValue) {
    // Handle input clear
    if(newValue === ''){
      setValue(newValue);
      props.onChange(newValue);
    }
  }

  return (
    <SearchAutocomplete
      id="search"
      PopperComponent={ResultsContainer}
      PaperComponent={ResultsContainer}
      ListboxComponent={ListboxContainer}
      freeSolo
      open
      fullWidth
      options={options}
      noOptionsText='No vendors found'
      getOptionLabel={option => option.name}
      value={value}
      onChange={handleChange}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField {...params} label="Search vendors" variant="outlined" margin="normal" />
      )}
      renderOption={(option, { inputValue }) => {
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);

        return (
          <ListItem button disableGutters>
          <ListItemText
            key={option.uid}
            primary={
              <React.Fragment>
                {parts.map((part, index) => (
                  <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }} >
                    {part.text}
                  </span>
                ))}
              </React.Fragment>
            }
          />
          </ListItem>
        );
      }}
    />
  );
}