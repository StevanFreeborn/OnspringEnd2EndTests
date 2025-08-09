import { APIRequestContext, APIResponse, expect, Page, Request, request } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync, ReadStream, rmSync, writeFileSync } from 'fs';
import path from 'path';
import { Serializable } from 'playwright-core/types/structs';
import { env } from '../env';
import { FakeDataFactory } from '../factories/fakeDataFactory';
import { ApiKey } from '../models/apiKey';
import { App } from '../models/app';
import { AttachmentField } from '../models/attachmentField';
import { DateField } from '../models/dateField';
import { ImageField } from '../models/imageField';
import { ListField } from '../models/listField';
import { ListFormulaField } from '../models/listFormulaField';
import { ListValue } from '../models/listValue';
import { ReferenceField } from '../models/referenceField';
import { DisplayField, Report, SavedReportAsReportDataOnly } from '../models/report';
import { AppPermission, Role } from '../models/role';
import { TextField } from '../models/textField';
import { ApiKeyAdminPage } from '../pageObjectModels/apiKeys/apiKeyAdminPage';
import { ApiKeysAdminPage } from '../pageObjectModels/apiKeys/apiKeysAdminPage';
import { AppsAdminPage } from '../pageObjectModels/apps/appsAdminPage';
import { RolesSecurityAdminPage } from '../pageObjectModels/roles/rolesSecurityAdminPage';
import { createApp } from './app.fixtures';
import { createFields } from './field.fixtures';
import { createReport } from './report.fixtures';
import { createRole } from './role.fixures';

export type ApiSetupResult = {
  app: App;
  fields: ReturnType<typeof getTestFields>;
  report: Report;
  role: Role;
  apiKey: ApiKey;
};

const FILE_DIRECTORY = 'apiSetupResults';
const FILE_NAME = `${env.TEST_ENV}_api_setup_result.json`;
const DIRECTORY_PATH = path.join(process.cwd(), FILE_DIRECTORY);
const FILE_PATH = path.join(DIRECTORY_PATH, FILE_NAME);

type RequestOptions = {
  data?: string | Buffer | Serializable;
  failOnStatusCode?: boolean;
  form?: { [key: string]: string | number | boolean } | FormData;
  headers?: { [key: string]: string };
  ignoreHTTPSErrors?: boolean;
  maxRedirects?: number;
  maxRetries?: number;
  multipart?:
    | FormData
    | {
        [key: string]: string | number | boolean | ReadStream | { name: string; mimeType: string; buffer: Buffer };
      };
  params?: { [key: string]: string | number | boolean } | URLSearchParams | string;
  timeout?: number;
};

class APIRequestContextDecorator implements APIRequestContext {
  private context: APIRequestContext;
  private responseAssertions: Array<(response: APIResponse) => void>;

  constructor(context: APIRequestContext) {
    this.context = context;
    this.responseAssertions = [];
  }

  private handleResponse(response: APIResponse) {
    for (const assertion of this.responseAssertions) {
      assertion(response);
    }
  }

  onResponse(callback: (response: APIResponse) => void) {
    this.responseAssertions.push(callback);
  }

  async put(url: string, options?: RequestOptions) {
    const response = await this.context.put(url, options);
    this.handleResponse(response);
    return response;
  }

  async delete(urlOrRequest: string, options?: RequestOptions) {
    const response = await this.context.delete(urlOrRequest, options);
    this.handleResponse(response);
    return response;
  }

  dispose(options?: { reason?: string }) {
    return this.context.dispose(options);
  }

  async fetch(urlOrRequest: string | Request, options?: RequestOptions) {
    const response = await this.context.fetch(urlOrRequest, options);
    this.handleResponse(response);
    return response;
  }

  async get(url: string, options?: RequestOptions) {
    const response = await this.context.get(url, options);
    this.handleResponse(response);
    return response;
  }

  async head(url: string, options?: RequestOptions) {
    const response = await this.context.head(url, options);
    this.handleResponse(response);
    return response;
  }

  async patch(url: string, options?: RequestOptions) {
    const response = await this.context.patch(url, options);
    this.handleResponse(response);
    return response;
  }

  async post(url: string, options?: RequestOptions) {
    const response = await this.context.post(url, options);
    this.handleResponse(response);
    return response;
  }

  storageState(options?: { indexedDB?: boolean; path?: string }): Promise<{
    cookies: Array<{
      name: string;
      value: string;
      domain: string;
      path: string;
      expires: number;
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'Strict' | 'Lax' | 'None';
    }>;
    origins: Array<{ origin: string; localStorage: Array<{ name: string; value: string }> }>;
  }> {
    return this.context.storageState(options);
  }

  [Symbol.asyncDispose](): Promise<void> {
    return this.dispose();
  }
}

function ensureCacheControlAndPragmaHeadersPresent(response: APIResponse) {
  const headers = response.headers();
  const normalizedHeaders = Object.keys(headers).reduce(
    (acc, key) => {
      const value = headers[key];
      acc[key.toLowerCase()] = value.toLowerCase();
      return acc;
    },
    {} as Record<string, string>
  );

  const cacheControlHeader = normalizedHeaders['cache-control'];
  const pragmaHeader = normalizedHeaders['pragma'];

  expect(cacheControlHeader).toContain('no-store');
  expect(cacheControlHeader).toContain('no-cache');
  expect(pragmaHeader).toBe('no-cache');
}

export async function createRequestContextFixture(
  { apiUrl, setup }: { apiUrl: string; setup: ApiSetupResult },
  use: (r: APIRequestContext) => Promise<void>
) {
  const context = await request.newContext({
    baseURL: apiUrl,
    extraHTTPHeaders: {
      'x-apikey': setup.apiKey.key,
    },
  });

  const decoratedAPIContext = new APIRequestContextDecorator(context);

  decoratedAPIContext.onResponse(ensureCacheControlAndPragmaHeadersPresent);

  await use(decoratedAPIContext);

  await decoratedAPIContext.dispose();
}

export async function createApiSetupFixture(use: (r: ApiSetupResult) => Promise<void>) {
  const setup = getApiSetupResult();
  await use(setup);
}

export async function performApiTestsSetup({
  sysAdminPage,
  useCache = false,
}: {
  sysAdminPage: Page;
  useCache?: boolean;
}) {
  if (useCache && existsSync(FILE_PATH)) {
    return;
  }

  const testFields = getTestFields();
  const app = await createApp(sysAdminPage);
  const createdFields = await createFields(sysAdminPage, app, Object.values(testFields));

  const report = await createReport(
    sysAdminPage,
    app,
    new SavedReportAsReportDataOnly({
      appName: app.name,
      name: FakeDataFactory.createFakeReportName(),
      displayFields: createdFields.map(f => new DisplayField({ name: f.name })),
      security: 'Public',
    })
  );

  const role = await createRole(sysAdminPage, 'Active', [
    new AppPermission({
      appName: app.name,
      contentAdmin: { enable: true },
      reportAdmin: { enable: true },
    }),
  ]);

  const apiKey = await createApiKey(
    sysAdminPage,
    new ApiKey({
      name: FakeDataFactory.createFakeApiKeyName(),
      role: role.name,
      status: true,
    })
  );

  for (const field of Object.values(testFields)) {
    const createdField = createdFields.find(f => f.name === field.name);

    if (createdField === undefined) {
      continue;
    }

    field.id = createdField.id;
  }

  if (existsSync(DIRECTORY_PATH) === false) {
    mkdirSync(DIRECTORY_PATH);
  }

  writeFileSync(FILE_PATH, JSON.stringify({ app, fields: testFields, report, role, apiKey }, null, 2));
}

export async function performApiTestCleanup({
  sysAdminPage,
  useCache = false,
}: {
  sysAdminPage: Page;
  useCache?: boolean;
}) {
  if (useCache) {
    return;
  }

  const setup = getApiSetupResult();

  await new ApiKeysAdminPage(sysAdminPage).deleteApiKeys([setup.apiKey.name]);
  await new AppsAdminPage(sysAdminPage).deleteApps([setup.app.name]);
  await new RolesSecurityAdminPage(sysAdminPage).deleteRoles([setup.role.name]);

  rmSync(FILE_PATH);
}

function getApiSetupResult() {
  return JSON.parse(readFileSync(FILE_PATH, 'utf8')) as ApiSetupResult;
}

async function createApiKey(sysAdminPage: Page, key: ApiKey) {
  const apiKeysAdminPage = new ApiKeysAdminPage(sysAdminPage);
  const apiKeyAdminPage = new ApiKeyAdminPage(sysAdminPage);

  await apiKeysAdminPage.goto();
  await apiKeysAdminPage.createApiKey(key.name);
  await apiKeysAdminPage.page.waitForURL(apiKeyAdminPage.pathRegex);
  // eslint-disable-next-line playwright/no-wait-for-timeout
  await apiKeyAdminPage.page.waitForTimeout(5000);

  await apiKeyAdminPage.updateApiKey(key);
  await apiKeyAdminPage.save();

  key.key = await apiKeyAdminPage.getApiKey();
  return key;
}

function getTestFields() {
  return {
    nameField: new TextField({ name: FakeDataFactory.createFakeFieldName() }),
    descriptionField: new TextField({ name: FakeDataFactory.createFakeFieldName(), formatting: 'Multi-line' }),
    dueDate: new DateField({ name: FakeDataFactory.createFakeFieldName() }),
    ownerField: new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: 'Users' }),
    statusField: new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [
        new ListValue({ value: 'In Progress', numericValue: 0 }),
        new ListValue({ value: 'Complete', numericValue: 1 }),
      ],
    }),
    attachmentsField: new AttachmentField({ name: FakeDataFactory.createFakeFieldName() }),
    imageField: new ImageField({ name: FakeDataFactory.createFakeFieldName() }),
    formulaField: new ListFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: 'return [:Yes]',
      values: [new ListValue({ value: 'Yes' }), new ListValue({ value: 'No' })],
    }),
  };
}
