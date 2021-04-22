import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

function PlaceFinder(props) {
  return (
    <div>
      <Autocomplete
        style={{ width: '100%' }}
        options={props.streetNames}
        getOptionSelected={(option, value) => option === value}
        onChange={(event, newValue) => {
          props.setStreetName(newValue);
        }}
        renderInput={(params) => 
          <TextField {...params} label="Street Name" variant="outlined" />
        }
      />
    </div>
  );
};

export default PlaceFinder;
