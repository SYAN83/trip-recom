import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import intersections from './data/intersections-small.min.json';

const streets1 = Object.keys(intersections).sort();

function Intersection(props) {
  const [street1, setStreet1] = React.useState('');
  const [street2, setStreet2] = React.useState('');
  const [streets2, setStreets2] = React.useState([]);

  React.useEffect(() => {
    let nodeId = '';
    let location = [];
    if ((street1 in intersections) && (street2 in intersections[street1])) {
      nodeId = intersections[street1][street2];
      location = [street1, street2];
    };
    props.setNode({
      id: nodeId,
      loc: location
    });

  }, [street2]);

  return (
    <div>
      <Autocomplete
        value={street1}
        onChange={(event, newValue) => {
          setStreet1(newValue);
          setStreets2(newValue in intersections ? Object.keys(intersections[newValue]).sort() : []);
          setStreet2('');
        }}
        options={streets1}
        renderInput={(params) => 
          <TextField {...params} label="First Street" variant="outlined" />
        }
      />
      <br />
      <Autocomplete
        value={street2}
        onChange={(event, newValue) => {
          setStreet2(newValue);
        }}
        options={streets2}
        renderInput={(params) => 
          <TextField {...params} label="Second Street" variant="outlined" />
        }
      />
    </div>
  );
};

export default Intersection;