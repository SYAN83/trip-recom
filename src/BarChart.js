import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { COLORS, TIME_OF_DAY } from './constants';

function timeToSeconds(time) {
  const minutes = (time * 60).toFixed(1)
  return minutes
};
export default function Barchart(props) {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    if (Object.keys(props.data).length === 2) {
      const times = TIME_OF_DAY.map(time => ({
        label: time.label.split(' (')[0], 
        Fastest: timeToSeconds(props.data.Fastest.timesOfDay.get(time.key)),
        Shortest: timeToSeconds(props.data.Shortest.timesOfDay.get(time.key))
      }));
      setData(times);
    } else {
      setData([])
    }
  }, [props]);
  
  return (
    <ResponsiveContainer width="100%" height={200}>
      {/* <h1>ABC </h1> */}
      <BarChart data={data} margin={{top: 10, right: 30, bottom: 10}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="Fastest" fill={COLORS[1]} />
        <Bar dataKey="Shortest" fill={COLORS[0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}