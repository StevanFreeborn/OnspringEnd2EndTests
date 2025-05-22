import 'dotenv/config';

const REPORT_SITE = "https://onspringqareports.stevanfreeborn.com"
const API_KEY = process.env.ONSPRING_CORP_API_KEY ?? process.argv[2];
const RELEASE_RECORD_ID = process.env.RELEASE_RECORD_ID ?? process.argv[3];
const ENVIRONMENT = process.env.ENVIRONMENT ?? process.argv[4];
const RESULT = process.env.RUN_RESULT ?? process.argv[5];
const REPORT_NAME = process.env.REPORT_NAME ?? process.argv[6];
const WORKFLOW_NUMBER = process.env.WORKFLOW_NUMBER ?? process.argv[7];
const WORKFLOW_ATTEMPT = process.env.WORKFLOW_ATTEMPT ?? process.argv[8];

const REQUIRED_ARGS = [API_KEY, RELEASE_RECORD_ID, ENVIRONMENT, RESULT, WORKFLOW_NUMBER, WORKFLOW_ATTEMPT];

for (const [index, arg] of REQUIRED_ARGS.entries()) {
  if (!arg) {
    console.error(`Missing required argument at index ${index}`);
    process.exit(1);
  }
}

const environmentListValuesMap = {
  ALPHA: '38eb9972-8d92-4032-9e7b-cb577206b8b3',
  BETA: '9f1fa75a-578d-4e01-b46a-922ce3d435a7',
  QA: '4a96f409-1e2b-4b05-9b64-dde3d1d31663',
  IST: 'e576c37d-9976-419f-bf7b-e5976ceb8e21',
  VPRIOR: '073dbe4c-c2de-46b3-8385-b60886cb354b',
  VNEXT: 'b64dc2db-9e80-4822-a1b3-add2aacfbcbd',
  PROD: '770d679e-23c6-4127-af66-27be70721a60',
  FEDSPRING_IST: '22645656-dbc4-4dca-8736-1f83fac8e095',
};

const resultListValuesMap = {
  failure: 'ce037eb6-fe1f-47f5-bb45-a6b3504a9e81',
  success: 'e0b25771-55b0-4ed7-955c-94c94392b481',
};

const envListValue = environmentListValuesMap[ENVIRONMENT];
const resultListValue = resultListValuesMap[RESULT];

if (!envListValue) {
  console.error('Invalid environment');
  process.exit(1);
}

if (!resultListValue) {
  console.error('Invalid result');
  process.exit(1);
}

const res = await fetch('https://api.onspring.ist/records', {
  method: 'PUT',
  headers: {
    'x-apikey': API_KEY,
    'x-api-version': 2,
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    appId: 672,
    fields: {
      44337: RELEASE_RECORD_ID,
      44339: envListValue,
      44340: resultListValue,
      44341: `${REPORT_SITE}/reports/${REPORT_NAME}`,
      44342: WORKFLOW_NUMBER,
      44343: WORKFLOW_ATTEMPT,
    },
  }),
});

if (res.ok === false) {
  console.error('Failed to create test run result');
  process.exit(1);
}

const { id } = await res.json();

console.log(`Test run result created with ID: ${id}`);
