import { displayTemperature, makeRequest } from './helpers.js';

const links = [
  {
    priority: 1,
    url: 'https://delay.piecioshka.io/delay?time=3000',
    value: 30,
  },
  {
    priority: 2,
    url: 'https://delay.piecioshka.io/delay?time=1000',
    value: 30.5,
  },
  {
    priority: 3,
    url: 'https://delay.piecioshka.io/delay?time=2000',
    value: 30.52,
  },
];

function breakRequests(requests) {
  requests.forEach((request) => request.controller.abort());
}

async function main() {
  console.log('main');

  const maxPriority = 3;
  let currentResponse = null;

  const requests = links.map((link) => {
    const controller = new AbortController();
    const options = { signal: controller.signal };
    const promise = makeRequest(link.url, options)
      .then((response) => {
        if (currentResponse === null) {
          // Save first response
          currentResponse = { ...link, ...response };
          displayTemperature(currentResponse.value);
        }

        if (link.priority === maxPriority) {
          // The best results
          currentResponse = { ...link, ...response };
          displayTemperature(currentResponse.value);
          breakRequests(requests);
        } else if (currentResponse.priority < link.priority) {
          // Better priority than current
          currentResponse = { ...link, ...response };
          displayTemperature(currentResponse.value);
        }
      })
      .catch((reason) => {
        // Ignore abort requests
      });
    return { promise, controller };
  });
}

window.addEventListener('DOMContentLoaded', main);
