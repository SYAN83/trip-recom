import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import TextField from '@material-ui/core/TextField';
import { ASearchShortest, ASearchFastest } from './algos/pathSearch';
import { TIME_OF_DAY } from './constants';
import Intersection from './Intersection';
import Barchart from './BarChart';
import nodes from './data/nodes-small.min.json';

const useStyles = makeStyles((theme) => ({
  list: {
    width: 360,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  timePicker: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  summaryDiv: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
  }
}));

function formatTime(time) {
  const hour = Math.floor(time);
  const minute = Math.round((time - hour) * 60)
  const timeStr = (hour > 0 ? hour + " hr " : "") + minute + " min"
  return timeStr
};

function NavPanel(props) {
  const classes = useStyles();
  const anchor = "right";
  const color = 'primary';

  const [state, setState] = React.useState(true);
  const [time, setTime] = React.useState("");
  const [startNode, setStartNode] = React.useState({});
  const [targetNode, setTargetNode] = React.useState({});
  const [routes, setRoutes] = React.useState({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const toggleDrawer = open => (event) => {
    setState(!state);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
  const handleReset = () => {
    setStartNode({});
    setTargetNode({});
    setRoutes({});
    setActiveStep(0);
  }

  const handleSearch = (async () => {
    setRoutes({});
    setLoading(true)
    console.log("search nodes:", startNode, targetNode);

    let routeS = await ASearchShortest(startNode.id, targetNode.id, time);
    let routeF = await ASearchFastest(startNode.id, targetNode.id, time);
    setLoading(false)
    setRoutes({ Shortest: routeS, Fastest: routeF });
    props.setSegments([
      {positions: routeS.coordinates, tooltip: "Shortest Route"}, 
      {positions: routeF.coordinates, tooltip: "Fastest Route"}, 
    ]);
  });

  React.useEffect(() => {
    if (activeStep === 2 && time !== "") handleSearch();
  }, [time])

  React.useEffect(() => {
    props.setNodes([startNode, targetNode].filter(node => node.id).map((node, idx) => {
      return { latlng: nodes[node.id], type: ['From: ', 'To: '][idx], ...node };
    }));
    props.setSegments([]);
  }, [startNode, targetNode]);

  return (
    <div>
      <div id="ctrl">
        <Fab color={color} variant="extended" onClick={toggleDrawer(true)}>
          <NavigationIcon className={classes.extendedIcon} />
          Navigate
        </Fab>
      </div>
      <div id="nav">
        <SwipeableDrawer open={state} anchor={anchor} variant="persistent">
          <div className={classes.list}>
            <strong>Trip Recommender</strong>
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step key='start'>
                <StepLabel>
                  <div>
                    <p align="left">From: {activeStep > 0 && startNode.loc.join(' & ')}</p>
                  </div>
                </StepLabel>
                <StepContent>
                  <Intersection setNode={setStartNode} />
                  <br />
                  <div className={classes.actionsContainer}>
                    {/* <Button className={classes.button} disabled={activeStep === 0} onClick={handleBack}>Back</Button> */}
                    <Button variant="contained" color={color} disabled={!startNode.id} onClick={handleNext} className={classes.button} >Next</Button>
                  </div>
                </StepContent>
              </Step>
              <Step key='target'>
                <StepLabel>
                  <div>
                    <p align="left">To: {activeStep > 1 && targetNode.loc.join(' & ')}</p>
                  </div>
                </StepLabel>
                <StepContent>
                  <Intersection setNode={setTargetNode} />
                  <br />
                  <div className={classes.actionsContainer}>
                    <Button className={classes.button} disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                    <Button variant="contained" color={color} disabled={!targetNode.id} onClick={handleNext} className={classes.button} >Next</Button>
                  </div>
                </StepContent>
              </Step>
              <Step key='summary'>
                <StepLabel>
                  <p align="left">Departure Time:</p>
                </StepLabel>
                <StepContent>
                  <Autocomplete
                    id="time-of-day"
                    options={TIME_OF_DAY}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, newValue) => {
                      newValue === null ? setTime("") : setTime(newValue.key)
                    }}
                    renderInput={(params) => <TextField {...params} label="Time of Day" variant="outlined" />}
                  />
                </StepContent>
              </Step>
            </Stepper>
          </div>
          <div className={classes.summaryDiv}>
            <hr/>
            {loading ? <CircularProgress /> : Object.entries(routes).map(([key, route]) =>
              <div>
                <p align="left"><em>{key} Route:</em></p>
                {route && <p align="left">- Dist.: {route.distance && route.distance.toFixed(2) + " mi"} | Est. Time: {route.time && formatTime(route.time)}</p>}
              </div>)
            }
          </div>
          {Object.keys(routes).length === 2 && "Average travel times by period (min)"}
          {Object.keys(routes).length === 2 && <Barchart data={routes}/>}
          {activeStep === 2 && !loading && (
            <div>
              <Button onClick={handleReset} className={classes.button}>Reset</Button>
            </div>
          )}          
        </SwipeableDrawer>
      </div>
    </div>
  );
};

export default NavPanel;
