/* eslint-disable no-console */
import 'dotenv/config';

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const RENDER_SERVICE_ID = process.env.RENDER_REPORT_SITE_SERVICE_ID;
const DEPLOY_SERVICE_ENDPOINT = `https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys`;
const BASE_HEADERS = {
  Authorization: `Bearer ${RENDER_API_KEY}`,
};
const MS_PER_SEC = 1000;
const MS_PER_MIN = 60 * MS_PER_SEC;
const RETRY_LIMIT = 5;
const BASE_DELAY_IN_MS = 5 * MS_PER_SEC;

run().catch(err => {
  console.error(err);
  process.exit(1);
});

/**
 * @summary Runs the deployment script.
 * @returns {Promise<void>} A promise that resolves when the script is done.
 */
async function run() {
  if (RENDER_API_KEY === undefined) {
    throw new Error('RENDER_API_KEY must be set');
  }

  if (RENDER_SERVICE_ID === undefined) {
    throw new Error('RENDER_REPORT_SITE_SERVICE_ID must be set');
  }

  const deploymentResponse = await executeWithRetry(triggerDeployment);

  if (deploymentResponse.ok === false) {
    console.log(`Deployment failed: ${deploymentResponse.status} - ${await deploymentResponse.text()}`);
    process.exit(1);
  }

  const { id: deployId } = await deploymentResponse.json();

  if (deployId === undefined) {
    console.log('Deployment failed: no deploy id returned');
    process.exit(1);
  }

  console.log(`Deployment started: ${deployId}`);

  let status = 'created';

  do {
    const statusResponse = await executeWithRetry(() => getDeployment(deployId));
    if (statusResponse.ok === false) {
      console.log(`Deployment failed: ${statusResponse.status} - ${await statusResponse.text()}`);
      process.exit(1);
    }

    const { status: newStatus } = await statusResponse.json();

    console.log(`Deployment status: ${newStatus}`);
    status = newStatus;

    if (status !== 'live') {
      await wait(15 * MS_PER_SEC);
    }
  } while (
    status === 'created' ||
    status === 'build_in_progress' ||
    status === 'update_in_progress' ||
    status === 'pre_deploy_in_progress'
  );

  if (status !== 'live') {
    console.log('Deployment failed');
    process.exit(1);
  }

  console.log('Deployment succeeded');
}

/**
 * @summary Triggers a deployment.
 * @returns {Promise<Response>} The response from the fetch.
 */
function triggerDeployment() {
  return fetch(DEPLOY_SERVICE_ENDPOINT, {
    method: 'POST',
    headers: {
      ...BASE_HEADERS,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * @summary Gets the deployment for the specified id.
 * @param {string} deployId The id of the deployment to get.
 * @returns {Promise<Response>} The response from the fetch.
 */
function getDeployment(deployId) {
  return fetch(`${DEPLOY_SERVICE_ENDPOINT}/${deployId}`, {
    method: 'GET',
    headers: BASE_HEADERS,
  });
}

/**
 * @summary Executes the specified callback and retries if the response is a 429 or 5xx using exponential backoff.
 * @param {() => Promise<Response>} cb The callback to execute.
 * @returns {Promise<Response>} The response from the callback.
 */
async function executeWithRetry(cb) {
  let retries = 0;
  let response;

  do {
    response = await cb();

    if (response.ok) {
      break;
    }

    console.log(`Request failed: ${response.status} - ${await response.text()}`);

    if (response.status < 499 || response.status !== 429) {
      break;
    }

    const delay = Math.min(BASE_DELAY_IN_MS * 2 ** retries, 2 * MS_PER_MIN);

    console.log(`Retrying request...waiting ${delay / MS_PER_SEC} seconds`);
    await wait(delay);
    retries++;
  } while (retries < RETRY_LIMIT);

  return response;
}

/**
 * @summary Returns a promise that resolves after the specified delay.
 * @param {number} delay The delay in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
function wait(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}
