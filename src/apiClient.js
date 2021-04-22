import fetch from 'cross-fetch';

export function fetchSpeeds(nodePairs, timeOfDay) {
	const response = fetch('/speeds', {
    headers: {"content_type": "application/json"},
    method: "POST",
    body: JSON.stringify({"node_pairs": nodePairs, "time_of_day": timeOfDay}),
  })
	.then(res => res.json())
  .then(data => data['speeds'])

  return response;
};
