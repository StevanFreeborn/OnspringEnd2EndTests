import { Page } from '@playwright/test';
import { FakeDataFactory } from '../factories/fakeDataFactory';
import { App } from '../models/app';
import { AttachmentField } from '../models/attachmentField';
import { DateField } from '../models/dateField';
import { ImageField } from '../models/imageField';
import { LayoutItem } from '../models/layoutItem';
import { ListField } from '../models/listField';
import { ListValue } from '../models/listValue';
import { ReferenceField } from '../models/referenceField';
import { TextField } from '../models/textField';
import { createApp } from './app.fixtures';
import { createFields } from './field.fixtures';

const apiTestAppFields = {
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

export async function performApiTestsSetup(
  { sysAdminPage }: { sysAdminPage: Page },
  use: (r: { app: App; fields: LayoutItem[] }) => Promise<void>
) {
  const app = await createApp(sysAdminPage);
  const fields = await createFields(sysAdminPage, app, Object.values(apiTestAppFields));
  await use({ app, fields });
}
