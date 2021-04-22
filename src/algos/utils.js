// mean earth radius in miles
const RADIUS = 3958.761;  
const TO_RAD = Math.PI / 180;

export function greatCircleDistance(...args) {
  // https://en.wikipedia.org/wiki/Great-circle_distance

  function dist([lat1, lng1], [lat2, lng2]) {
    let _lat = (lat1 - lat2) / 2;
    let _lng = (lng1 - lng2) / 2;
    let x = Math.pow(Math.sin(_lat), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(_lng), 2);
    return 2 * Math.asin(Math.sqrt(x))
  };

  let coordinates = args.map(([lat, lng]) => [lat * TO_RAD, lng * TO_RAD]);
  let distance = coordinates.slice(1).map((value, index) => dist(value, coordinates[index])).reduce((a, b) => a + b, 0) * RADIUS;
  return distance;
};