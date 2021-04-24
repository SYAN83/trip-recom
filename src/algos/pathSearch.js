import Heap from 'heap-js';
import { fetchSpeeds } from "../apiClient";
import { greatCircleDistance } from './utils';
import { TIME_OF_DAY } from '../constants';
import links from '../data/links-small.min.json';
import nodes from '../data/nodes-small.min.json';

const MAX_SEARCH = 100000;
const SPEED_UB = 45.0;  // speed 99%
const SPEEDS = new Map();

async function getRoute(path, timeOfDay) {
  if (path.length < 2) return {coordinates: [], distance: undefined, time: undefined}
  const nodePairs = path.slice(1).map((val, idx) => [path[idx], val])
  const speedsOfDay = [];

  for (const time of TIME_OF_DAY ) {
    const fetchedSpeeds = await fetchSpeeds(nodePairs, time.key);
    speedsOfDay.push([time.key, fetchedSpeeds]);
  };
  
  let coord = [nodes[path[0]]];
  let dist = 0;
  let times = new Map(TIME_OF_DAY.map(time => [time.key, 0]));
  console.log('times init:', times)
  for (let i = 0; i < path.length - 1; i++) {
    let segmentDist = links[path[i]][path[i+1]].distance
    dist += segmentDist;
    speedsOfDay.forEach(([time, speeds]) => {
      console.log('speedsOfDay foreach', time, segmentDist, speeds[i])
      times.set(time, times.get(time) + segmentDist / speeds[i])
    });
    if ('coordinates' in links[path[i]][path[i+1]]) {
      coord.push(...links[path[i]][path[i+1]].coordinates)
    }
    coord.push(nodes[path[i+1]])
  };
  console.log('times final:', times)
  const route = {
    coordinates: coord,
    distance: dist,
    time: times.get(timeOfDay),
    timesOfDay: times
  };
  return route;
};

export async function ASearchShortest(start, goal, timeOfDay, preFetchSpeeds=true) {
  let counter = 0;
  const cameFrom = new Map();
  const gScore = new Map();
  const openSet = new Heap();

  gScore.set(start, 0);
  openSet.push([heuristic(start, goal), start]);
  while (!openSet.isEmpty()) {
    const current = openSet.pop()[1];
    if (current === goal) {
      console.log('A* Search count (shortest):', counter);
      let path = reconstructPath(cameFrom, start, goal);
      if (preFetchSpeeds) {
        // prefetch speeds of visited nodes to speed up ASearchFastest
        const fromNodes = new Set(cameFrom.values());
        SPEEDS.set(timeOfDay, await batchFetchSpeeds(Array.from(fromNodes), timeOfDay))
      };
      return getRoute(path, timeOfDay);
    } else {
      Object.keys(links[current]).forEach(neighbor => {
        const tentative_gScore = gScore.get(current) + links[current][neighbor].distance;
        if (tentative_gScore < (gScore.get(neighbor) || Infinity)) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentative_gScore);
          openSet.push([tentative_gScore + heuristic(neighbor, goal), neighbor]);
          counter += 1;
        };
      });
      if (counter > MAX_SEARCH) break;
    };
  };
  return getRoute([]);
};

export async function ASearchFastest(start, goal, timeOfDay) {
  let counter = 0;
  const cameFrom = new Map();
  const gScore = new Map();
  const openSet = new Heap();
  const speeds = SPEEDS.get(timeOfDay) || new Map();

  gScore.set(start, 0);
  openSet.push([heuristic(start, goal), start]);
  while (!openSet.isEmpty()) {
    const current = openSet.pop()[1];
    if (current === goal) {
      console.log('A* Search count (fastest):', counter);
      let path = reconstructPath(cameFrom, start, goal)
      return getRoute(path, timeOfDay)
    } else {
      if (!speeds.has(current)) {
        const fromNodes = setFromNodes(current, 7);
        fromNodes.forEach(node => {
          if (speeds.has(node)) fromNodes.delete(node);
        })
        const fetchedSpeeds = await batchFetchSpeeds(Array.from(fromNodes), timeOfDay)
        fetchedSpeeds.forEach((value, key) => speeds.set(key, value))
      }
      Object.keys(links[current]).forEach(neighbor => {
        const speed = speeds.get(current).get(neighbor);
        const factor = 1 + (1 - Math.min(1, speed / SPEED_UB)) * 1; 
        const tentative_gScore = gScore.get(current) + links[current][neighbor].distance * factor;
        if (tentative_gScore < (gScore.get(neighbor) || Infinity)) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentative_gScore);
          const h = heuristic(neighbor, goal);
          openSet.push([tentative_gScore + h, neighbor]);
          counter += 1;
        };
      });
      if (counter > MAX_SEARCH) {
        console.log('max search reached')
        break;
      };
    };
  };
  return getRoute([]);
};

function heuristic(fromNode, toNode) {
  return greatCircleDistance(nodes[fromNode], nodes[toNode]);
};

function reconstructPath(cameFrom, start, goal) {
  let current = goal
  let path = [current];
  while (current !== start && cameFrom.has(current)) {
    current = cameFrom.get(current)
    path.unshift(current);
  }
  return path;
};

async function batchFetchSpeeds(fromNodes, timeOfDay) {
  // console.log("fetch speeds in batch:", fromNodes.length);
  const nodePairs = [];
  const speeds = new Map();
  fromNodes.forEach(fromNode => {
    speeds.set(fromNode, new Map());
    nodePairs.push(...Object.keys(links[fromNode]).map(toNode => [fromNode, toNode]));
  });
  const fetchedSpeeds = await fetchSpeeds(nodePairs, timeOfDay);
  nodePairs.forEach(([fromNode, toNode], idx) => {
    speeds.get(fromNode).set(toNode, fetchedSpeeds[idx]);
  });
  return speeds;
};

function setFromNodes(fromNode, level=2) {
  const fromNodes = new Set().add(fromNode);
  if (level > 0) {
    Object.keys(links[fromNode]).forEach(toNode => {
      setFromNodes(toNode, level=level-1).forEach(node => fromNodes.add(node))
    });
  };
  return fromNodes
};