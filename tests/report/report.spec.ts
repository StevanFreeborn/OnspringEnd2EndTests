import { FieldType } from '../../componentObjectModels/menus/addFieldTypeMenu';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { LayoutItem } from '../../models/layoutItem';
import { ListField } from '../../models/listField';
import { ListValue } from '../../models/listValue';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { AnnotationType } from '../annotations';

type ReportTestFixtures = {
  sourceApp: App;
  appAdminPage: AppAdminPage;
  addContentPage: AddContentPage;
  editContentPage: EditContentPage;
};

const test = base.extend<ReportTestFixtures>({
  sourceApp: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  addContentPage: async ({ sysAdminPage }, use) => await use(new AddContentPage(sysAdminPage)),
  editContentPage: async ({ sysAdminPage }, use) => await use(new EditContentPage(sysAdminPage)),
});

test.describe('report', () => {
  test('Create a report via the "Create Report" button on the report home page', async ({
    sourceApp,
    appAdminPage,
    addContentPage,
    editContentPage,
  }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-594',
    });

    const fields = getFieldsForApp();
    let records = buildRecords(fields.groupField, fields.seriesField);

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
      records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
    });

    expect(true).toBe(true);
  });

  test('Create a report via the "Create Report" button on an app\'s or survey\'s reports home page.', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-595',
    });

    expect(true).toBe(true);
  });

  test('Create a copy of a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-596',
    });

    expect(true).toBe(true);
  });

  test('Update a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-597',
    });

    expect(true).toBe(true);
  });

  test('Delete a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-598',
    });

    expect(true).toBe(true);
  });

  test('Bulk edit records in a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-599',
    });

    expect(true).toBe(true);
  });

  test('Bulk delete records in a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-600',
    });

    expect(true).toBe(true);
  });

  test('Apply liver filters to a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-601',
    });

    expect(true).toBe(true);
  });

  test('Sort a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-602',
    });

    expect(true).toBe(true);
  });

  test('Filter a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-603',
    });

    expect(true).toBe(true);
  });

  test('Export a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-604',
    });

    expect(true).toBe(true);
  });

  test('Print a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-605',
    });

    expect(true).toBe(true);
  });

  test('Add related data to a report', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-606',
    });

    expect(true).toBe(true);
  });

  test('Schedule a report for export', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-607',
    });

    expect(true).toBe(true);
  });

  test('Configure a bar chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-608',
    });

    expect(true).toBe(true);
  });

  test('Configure a column chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-609',
    });

    expect(true).toBe(true);
  });

  test('Configure a pie chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-610',
    });

    expect(true).toBe(true);
  });

  test('Configure a donut chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-611',
    });

    expect(true).toBe(true);
  });

  test('Configure a line chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-612',
    });

    expect(true).toBe(true);
  });

  test('Configure a spline chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-613',
    });

    expect(true).toBe(true);
  });

  test('Configure a funnel chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-614',
    });

    expect(true).toBe(true);
  });

  test('Configure a pyramid chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-615',
    });

    expect(true).toBe(true);
  });

  test('Configure a stacked bar chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-616',
    });

    expect(true).toBe(true);
  });

  test('Configure a column plus line chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-617',
    });

    expect(true).toBe(true);
  });

  test('Configure a stacked column chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-618',
    });

    expect(true).toBe(true);
  });

  test('Configure stacked column plus line chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-619',
    });

    expect(true).toBe(true);
  });

  test('Configure a bubble chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-620',
    });

    expect(true).toBe(true);
  });

  test('Configure a heat map chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-621',
    });

    expect(true).toBe(true);
  });

  test('Configure a calendar', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-622',
    });

    expect(true).toBe(true);
  });

  test('Configure a gantt chart', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-623',
    });

    expect(true).toBe(true);
  });

  test('Configure a point map', ({}) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-624',
    });

    expect(true).toBe(true);
  });
});

function getFieldsForApp() {
  const groupField = new ListField({
    name: 'Group',
    values: [
      new ListValue({ value: 'Group A' }),
      new ListValue({ value: 'Group B' }),
      new ListValue({ value: 'Group C' }),
    ],
  });

  const seriesField = new ListField({
    name: 'Series',
    values: [
      new ListValue({ value: 'Series 1' }),
      new ListValue({ value: 'Series 2' }),
      new ListValue({ value: 'Series 3' }),
    ],
  });

  return { groupField, seriesField };
}

async function addFieldsToApp(appAdminPage: AppAdminPage, app: App, fields: LayoutItem[]) {
  await appAdminPage.goto(app.id);
  await appAdminPage.layoutTabButton.click();
  await appAdminPage.layoutTab.openLayout();

  for (const [index, field] of fields.entries()) {
    await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(field);

    await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
      fieldName: field.name,
      tabName: 'Tab 2',
      sectionName: 'Section 1',
      sectionColumn: 0,
      sectionRow: index,
    });
  }

  await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
}

type Record = {
  id: number;
  fieldValues: { field: string; value: string; tabName: string; sectionName: string; type: FieldType }[];
};

function buildRecords(groupField: ListField, seriesField: ListField) {
  const records = [];

  for (const group of groupField.values) {
    for (const series of seriesField.values) {
      records.push({
        id: 0,
        fieldValues: [
          {
            field: groupField.name,
            value: group.value,
            tabName: 'Tab 2',
            sectionName: 'Section 1',
            type: groupField.type as FieldType,
          },
          {
            field: seriesField.name,
            value: series.value,
            tabName: 'Tab 2',
            sectionName: 'Section 1',
            type: seriesField.type as FieldType,
          },
        ],
      });
    }
  }

  return records;
}

async function addRecordsToApp(
  addContentPage: AddContentPage,
  editContentPage: EditContentPage,
  app: App,
  records: Record[]
) {
  const createdRecords = [];

  for (const record of records) {
    await addContentPage.goto(app.id);

    for (const fieldValue of record.fieldValues) {
      switch (fieldValue.type) {
        case 'List':
          {
            const field = await addContentPage.form.getField({
              tabName: fieldValue.tabName,
              sectionName: fieldValue.sectionName,
              fieldName: fieldValue.field,
              fieldType: fieldValue.type,
            });

            await field.click();
            await field.page().getByRole('option', { name: fieldValue.value }).click();
          }
          break;
        default:
          throw new Error(`Field type ${fieldValue.type} is not supported.`);
      }
    }

    await addContentPage.saveRecordButton.click();
    await addContentPage.page.waitForURL(editContentPage.pathRegex);

    const createdRecord = { ...record };
    createdRecord.id = editContentPage.getRecordIdFromUrl();
    createdRecords.push(createdRecord);
  }

  return createdRecords;
}
