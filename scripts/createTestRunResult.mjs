const API_KEY = process.argv[2];
const RELEASE_RECORD_ID = process.argv[3];
const ENVIRONMENT = process.argv[4];
const RESULT = process.argv[5];
const REPORT_URL = process.argv[6];
const WORKFLOW_NUMBER = process.argv[7];
const WORKFLOW_ATTEMPT = process.argv[8];

const REQUIRED_ARGS = [API_KEY, RELEASE_RECORD_ID, ENVIRONMENT, RESULT, REPORT_URL, WORKFLOW_NUMBER, WORKFLOW_ATTEMPT];

if (REQUIRED_ARGS.some(arg => !arg)) {
  console.error('Missing required argument');
  process.exit(1);
}

const environmentListValuesMap = {
  ALPHA: '6f662bda-bd21-42c0-949b-e66907193e7e',
  BETA: '8f9e8676-aeff-4abe-a658-250a430da1d1',
  QA: '2794c144-8457-48d1-87ad-31592431320a',
  IST: '9fcb72c5-a741-45ec-aeb1-52087a03f22c',
  VPRIOR: '2d82f659-881c-44c8-ba96-c2ff18bb172c',
  VNEXT: '35119fcc-c229-4c7b-bfb2-c265836f4ea1',
  PROD: '2bd3c586-e233-4bf4-ab4b-8a6b25a9789d',
  FEDSPRING_IST: '4a67c97a-b5e3-48fb-8432-39e7cbf9dbb8',
};

const resultListValuesMap = {
  failure: 'd68e5251-a53d-4c33-85f1-4c5fac2587ea',
  success: 'b887ca04-be14-4d75-9e4f-6d2e03b5f4f8',
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

const res = await fetch('https://api.onspring.ist/Records', {
  method: 'PUT',
  headers: {
    'x-apikey': API_KEY,
    'x-api-version': 2,
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    appId: 380,
    fields: {
      11660: RELEASE_RECORD_ID,
      11663: envListValue,
      11662: resultListValue,
      11664: REPORT_URL,
      11666: WORKFLOW_NUMBER,
      11667: WORKFLOW_ATTEMPT,
    },
  }),
});

if (res.ok === false) {
  console.error('Failed to create test run result');
  process.exit(1);
}

const { id } = await res.json();

console.log(`Test run result created with ID: ${id}`);
