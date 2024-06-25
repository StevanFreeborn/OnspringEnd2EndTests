import { Page, request } from '@playwright/test';
import { FakeDataFactory } from '../factories/fakeDataFactory';
import { ApiKey } from '../models/apiKey';
import { App } from '../models/app';
import { AttachmentField } from '../models/attachmentField';
import { DateField } from '../models/dateField';
import { ImageField } from '../models/imageField';
import { ListField } from '../models/listField';
import { ListValue } from '../models/listValue';
import { ReferenceField } from '../models/referenceField';
import { Report, SavedReport } from '../models/report';
import { AppPermission } from '../models/role';
import { TextField } from '../models/textField';
import { ApiKeyAdminPage } from '../pageObjectModels/apiKeys/apiKeyAdminPage';
import { ApiKeysAdminPage } from '../pageObjectModels/apiKeys/apiKeysAdminPage';
import { createApp } from './app.fixtures';
import { createFields } from './field.fixtures';
import { createReport } from './report.fixtures';
import { createRole } from './role.fixures';

export type ApiSetupResult = {
  app: App;
  fields: ReturnType<typeof getTestFields>;
  report: Report;
  apiKey: ApiKey;
};

export async function performApiTestsSetup({ sysAdminPage }: { sysAdminPage: Page }) {
  const testFields = getTestFields();
  const app = await createApp(sysAdminPage);
  const createdFields = await createFields(sysAdminPage, app, Object.values(testFields));

  const report = await createReport(
    sysAdminPage,
    app,
    new SavedReport({
      appName: app.name,
      name: FakeDataFactory.createFakeReportName(),
      displayFields: createdFields.map(f => f.name),
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

  return { app, fields: testFields, report, apiKey };
}

async function createApiKey(sysAdminPage: Page, key: ApiKey) {
  const apiKeysAdminPage = new ApiKeysAdminPage(sysAdminPage);
  const apiKeyAdminPage = new ApiKeyAdminPage(sysAdminPage);

  await apiKeysAdminPage.goto();
  await apiKeysAdminPage.createApiKey(key.name);
  await apiKeysAdminPage.page.waitForURL(apiKeyAdminPage.pathRegex);

  await apiKeyAdminPage.updateApiKey(key);
  await apiKeyAdminPage.save();

  key.key = await apiKeyAdminPage.getApiKey();
  return key;
}

export async function createRequestContext(apiUrl: string, apiKey: string) {
  return request.newContext({
    baseURL: apiUrl,
    extraHTTPHeaders: {
      'x-apikey': apiKey,
    },
  });
}

function getTestFields() {
  return {
    nameField: new TextField({ name: FakeDataFactory.createFakeFieldName() }),
    descriptionField: new TextField({ name: FakeDataFactory.createFakeFieldName(), formatting: 'Multi-line' }),
    dueDate: new DateField({ name: FakeDataFactory.createFakeFieldName() }),
    ownerField: new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: 'Users' }),
    statusField: new ListField({
      name: FakeDataFactory.createFakeFieldName(),
      values: [new ListValue({ value: 'In Progress' }), new ListValue({ value: 'Complete' })],
    }),
    attachmentsField: new AttachmentField({ name: FakeDataFactory.createFakeFieldName() }),
    imageField: new ImageField({ name: FakeDataFactory.createFakeFieldName() }),
  };
}
