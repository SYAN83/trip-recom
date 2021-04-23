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
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { ASearchShortest, ASearchFastest } from './algos/pathSearch';
import Intersection from './Intersection';
import nodes from './data/nodes-small.min.json';

const useStyles = makeStyles((theme) => ({
  list: {
    width: 320,
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
}));

function formatTime(time) {
  const hour = Math.floor(time);
  const minute = Math.round((time - hour) * 60)
  const timeStr = (hour > 0 ? hour + " hr " : "") + minute + " min"
  return timeStr
};

const timeOfDay = [
  { label: "AM Peak (7AM - 10AM)", key: "am_peak" },
  { label: "Midday (10AM - 4PM)", key: "midday" },
  { label: "PM Peak (4PM - 7PM)", key: "pm_peak" },
  { label: "Evening (7PM - 12AM)", key: "evening" },
  { label: "Early Morning (12AM - 7AM)", key: "early_morning" },
]

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
    handleNext();
    handleRefresh();
  });

  const handleRefresh = (async () => {
    setRoutes({});
    setLoading(true)
    console.log("search nodes:", startNode, targetNode);

    let routeS = await ASearchShortest(startNode.id, targetNode.id, time);
    let routeF = await ASearchFastest(startNode.id, targetNode.id, time);
    setLoading(false)
    setRoutes({ Fastest: routeF, Shortest: routeS });
    props.setSegments([routeS.coordinates, routeF.coordinates])
  });

  React.useEffect(() => {
    props.setNodes([startNode, targetNode].filter(node => node.id).map(node => {
      return { latlng: nodes[node.id], ...node };
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
            <br />
            <Autocomplete
              id="time-of-day"
              options={timeOfDay}
              getOptionLabel={(option) => option.label}
              onChange={(event, newValue) => {
                newValue === null ? setTime("") : setTime(newValue.key)
              }}
              renderInput={(params) => <TextField {...params} label="Time of Day" variant="outlined" />}
            />
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step key='start'>
                <StepLabel>
                  <div>
                    <p align="left">From :</p>
                    <p>{activeStep > 0 && startNode.loc.join(' & ')}</p>
                  </div>
                </StepLabel>
                <StepContent>
                  <Intersection setNode={setStartNode} />
                  <br />
                  <div className={classes.actionsContainer}>
                    <Button className={classes.button} disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                    <Button variant="contained" color={color} disabled={!startNode.id} onClick={handleNext} className={classes.button} >Next</Button>
                  </div>
                </StepContent>
              </Step>
              <Step key='target'>
                <StepLabel>
                  <div>
                    <p align="left">To :</p>
                    <p>{activeStep > 1 && targetNode.loc.join(' & ')}</p>
                  </div>
                </StepLabel>
                <StepContent>
                  <Intersection setNode={setTargetNode} />
                  <br />
                  <div className={classes.actionsContainer}>
                    <Button className={classes.button} disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                    <Button variant="contained" color={color} disabled={!targetNode.id} onClick={handleSearch} className={classes.button} >Search</Button>
                  </div>
                </StepContent>
              </Step>
              <Step key='summary'>
                <StepLabel>
                  <p align="left">Route Summary:</p>
                </StepLabel>
                <StepContent>
                  {loading ? <CircularProgress /> : null}
                  {Object.entries(routes).map(([key, route]) =>
                    <div>
                      <p align="left"><em>{key} Route:</em></p>
                      {route && <p align="left">Dist.: {route.distance && route.distance.toFixed(2) + " mi"} | Est. Time: {route.time && formatTime(route.time)}</p>}
                    </div>)}
                </StepContent>
              </Step>
            </Stepper>
            {activeStep === 2 && !loading && (
              <Paper square elevation={0} className={classes.resetContainer}>
                <Button onClick={handleReset} className={classes.button}>Reset</Button>
                <Button variant="contained" color={color} onClick={handleRefresh} className={classes.button}>Search Again</Button>
              </Paper>
            )}
          </div>
        </SwipeableDrawer>
      </div>
      <div id="charts">
        <Paper elevation={3} />
      </div>
    </div>
  );
};

export default NavPanel;
