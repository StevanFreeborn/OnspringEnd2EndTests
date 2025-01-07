import fs from 'fs';
import { FieldType } from '../../componentObjectModels/menus/addFieldTypeMenu';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { writeCsvFile } from '../../fixtures/file.fixtures';
import { App } from '../../models/app';
import { DateField } from '../../models/dateField';
import { LayoutItem } from '../../models/layoutItem';
import { ListField } from '../../models/listField';
import { ListValue } from '../../models/listValue';
import { NumberField } from '../../models/numberField';
import { TextField } from '../../models/textField';
import { TimeSpanField } from '../../models/timeSpanField';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { ViewContentPage } from '../../pageObjectModels/content/viewContentPage';
import { DataImportsAdminPage } from '../../pageObjectModels/dataImports/dataImportsAdminPage';
import { EditDataImportPage } from '../../pageObjectModels/dataImports/editDataImportPage';
import { AnnotationType } from '../annotations';

type DataImportTestFixtures = {
  adminHomePage: AdminHomePage;
  editDataImportPage: EditDataImportPage;
  dataImportsAdminPage: DataImportsAdminPage;
  targetApp: App;
  createDataImportFile: () => Promise<string>;
};

const test = base.extend<DataImportTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    await use(adminHomePage);
  },
  editDataImportPage: async ({ sysAdminPage }, use) => {
    const editDataImportPage = new EditDataImportPage(sysAdminPage);
    await use(editDataImportPage);
  },
  dataImportsAdminPage: async ({ sysAdminPage }, use) => {
    const dataImportsAdminPage = new DataImportsAdminPage(sysAdminPage);
    await use(dataImportsAdminPage);
  },
  targetApp: app,
});

test.describe('data import', () => {
  let dataImportsToDelete: string[] = [];
  let importFilesToDelete: string[] = [];

  test.afterEach(async ({ dataImportsAdminPage }) => {
    await dataImportsAdminPage.deleteDataImports(dataImportsToDelete);

    for (const importFilePath of importFilesToDelete) {
      if (fs.existsSync(importFilePath) === false) {
        continue;
      }

      fs.rmSync(importFilePath);
    }

    dataImportsToDelete = [];
    importFilesToDelete = [];
  });

  test('Create a Data Import via the create button in the header of the admin home page', async ({
    adminHomePage,
    editDataImportPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-335',
    });

    const dataImportName = FakeDataFactory.createFakeDataImportName();

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the data import', async () => {
      await adminHomePage.createImportConfigUsingHeaderCreateButton(dataImportName);
      await adminHomePage.page.waitForURL(editDataImportPage.pathRegex);
    });

    await test.step('Verify the data import was created', async () => {
      await expect(editDataImportPage.dataFileTab.nameInput).toHaveValue(dataImportName);
    });
  });

  test('Create a Data Import via the create button on the Integrations tile on the admin home page', async ({
    adminHomePage,
    editDataImportPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-336',
    });

    const dataImportName = FakeDataFactory.createFakeDataImportName();
    dataImportsToDelete.push(dataImportName);

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the data import', async () => {
      await adminHomePage.createImportConfigUsingIntegrationsTileButton(dataImportName);
      await adminHomePage.page.waitForURL(editDataImportPage.pathRegex);
    });

    await test.step('Verify the data import was created', async () => {
      await expect(editDataImportPage.dataFileTab.nameInput).toHaveValue(dataImportName);
    });
  });

  test('Create a Data Import via the "Create Import Configuration" button on the data import home page', async ({
    dataImportsAdminPage,
    editDataImportPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-337',
    });

    const dataImportName = FakeDataFactory.createFakeDataImportName();
    dataImportsToDelete.push(dataImportName);

    await test.step('Navigate to the data import home page', async () => {
      await dataImportsAdminPage.goto();
    });

    await test.step('Create the data import', async () => {
      await dataImportsAdminPage.createDataImport(dataImportName);
      await dataImportsAdminPage.page.waitForURL(editDataImportPage.pathRegex);
    });

    await test.step('Verify the data import was created', async () => {
      await expect(editDataImportPage.dataFileTab.nameInput).toHaveValue(dataImportName);
    });
  });

  test('Create a copy of a Data Import via the create button in the header of the admin home page', async ({
    adminHomePage,
    editDataImportPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-338',
    });

    const dataImportToCopyName = FakeDataFactory.createFakeDataImportName();
    const dataImportCopyName = `${dataImportToCopyName} (1)`;
    dataImportsToDelete.push(dataImportToCopyName, dataImportCopyName);

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the data import to copy', async () => {
      await adminHomePage.createImportConfig(dataImportToCopyName);
      await adminHomePage.page.waitForURL(editDataImportPage.pathRegex);
    });

    await test.step('Create a copy of the data import', async () => {
      await adminHomePage.goto();
      await adminHomePage.createImportCopyUsingHeaderCreateButton(dataImportToCopyName, dataImportCopyName);
      await adminHomePage.page.waitForURL(editDataImportPage.pathRegex);
    });

    await test.step('Verify the data import was copied', async () => {
      await expect(editDataImportPage.dataFileTab.nameInput).toHaveValue(dataImportCopyName);
    });
  });

  test('Create a copy of a Data Import via the create button on the Integrations tile on the admin home page', async ({
    adminHomePage,
    editDataImportPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-339',
    });

    const dataImportToCopyName = FakeDataFactory.createFakeDataImportName();
    const dataImportCopyName = `${dataImportToCopyName} (1)`;
    dataImportsToDelete.push(dataImportToCopyName, dataImportCopyName);

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the data import to copy', async () => {
      await adminHomePage.createImportConfig(dataImportToCopyName);
      await adminHomePage.page.waitForURL(editDataImportPage.pathRegex);
    });

    await test.step('Create a copy of the data import', async () => {
      await adminHomePage.goto();
      await adminHomePage.createImportCopyUsingIntegrationsTileButton(dataImportToCopyName, dataImportCopyName);
      await adminHomePage.page.waitForURL(editDataImportPage.pathRegex);
    });

    await test.step('Verify the data import was copied', async () => {
      await expect(editDataImportPage.dataFileTab.nameInput).toHaveValue(dataImportCopyName);
    });
  });

  test('Create a copy of a Data Import via the "Create Import Configuration" button on the data import home page', async ({
    dataImportsAdminPage,
    editDataImportPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-340',
    });

    const dataImportToCopyName = FakeDataFactory.createFakeDataImportName();
    const dataImportCopyName = `${dataImportToCopyName} (1)`;
    dataImportsToDelete.push(dataImportToCopyName, dataImportCopyName);

    await test.step('Navigate to the data import home page', async () => {
      await dataImportsAdminPage.goto();
    });

    await test.step('Create the data import to copy', async () => {
      await dataImportsAdminPage.createDataImport(dataImportToCopyName);
      await dataImportsAdminPage.page.waitForURL(editDataImportPage.pathRegex);
    });

    await test.step('Create a copy of the data import', async () => {
      await dataImportsAdminPage.goto();
      await dataImportsAdminPage.createDataImportCopy(dataImportToCopyName, dataImportCopyName);
      await dataImportsAdminPage.page.waitForURL(editDataImportPage.pathRegex);
    });

    await test.step('Verify the data import was copied', async () => {
      await expect(editDataImportPage.dataFileTab.nameInput).toHaveValue(dataImportCopyName);
    });
  });

  test('Update a Data Import', async ({
    sysAdminPage,
    adminHomePage,
    editDataImportPage,
    dataImportsAdminPage,
    targetApp,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-342',
    });

    const textField = new TextField({ name: 'Text Field' });

    const dataToImport = [
      {
        [textField.name]: 'Text Field Value',
      },
    ];

    const dataImportName = FakeDataFactory.createFakeDataImportName();
    const updatedDataImportName = `${dataImportName} (Updated)`;
    dataImportsToDelete.push(updatedDataImportName);

    let importFilePath: string;

    await test.step('Create the fields to import data into', async () => {
      const appAdminPage = new AppAdminPage(sysAdminPage);
      await appAdminPage.goto(targetApp.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textField);
    });

    await test.step('Create the import file to be imported', () => {
      importFilePath = writeCsvFile(dataToImport);
      importFilesToDelete.push(importFilePath);
    });

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the data import to be updated', async () => {
      await adminHomePage.createImportConfig(dataImportName);
      await adminHomePage.page.waitForURL(editDataImportPage.pathRegex);
    });

    await test.step('Update the data import', async () => {
      await editDataImportPage.dataFileTab.nameInput.fill(updatedDataImportName);
      await editDataImportPage.dataFileTab.selectTargetApp(targetApp.name);
      await editDataImportPage.dataFileTab.addImportFile(importFilePath);

      await editDataImportPage.dataMappingTabButton.click();
      const fieldMapping = editDataImportPage.dataMappingTab.getFieldMapping(textField.name);
      const regex = new RegExp(textField.name, 'i');
      await expect(fieldMapping.appField).toHaveText(regex);
      await expect(fieldMapping.mappedField).toHaveText(regex);

      await editDataImportPage.save();
    });

    await test.step('Verify the data import was updated', async () => {
      await dataImportsAdminPage.goto();

      const updatedDataImportRow = dataImportsAdminPage.dataImportGrid.getByRole('row', {
        name: updatedDataImportName,
      });

      await expect(updatedDataImportRow).toBeVisible();
    });
  });

  test('Delete a Data Import', async ({ adminHomePage, editDataImportPage, dataImportsAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-343',
    });

    const dataImportName = FakeDataFactory.createFakeDataImportName();

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the data import to be deleted', async () => {
      await adminHomePage.createImportConfig(dataImportName);
      await adminHomePage.page.waitForURL(editDataImportPage.pathRegex);
    });

    await test.step('Delete the data import', async () => {
      await dataImportsAdminPage.goto();
      await dataImportsAdminPage.deleteDataImports([dataImportName]);
    });

    await test.step('Verify the data import was deleted', async () => {
      const dataImportRow = dataImportsAdminPage.dataImportGrid.getByRole('row', {
        name: dataImportName,
      });

      await expect(dataImportRow).toBeHidden();
    });
  });

  test('Run a Data Import', async ({ sysAdminPage, adminHomePage, editDataImportPage, targetApp, sysAdminEmail }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-341',
    });

    const today = new Date();

    const importData = [
      {
        field: new TextField({ name: 'Text Field' }),
        value: 'Text Field Value',
      },
      {
        field: new DateField({ name: 'Date Field' }),
        value: `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`,
      },
      {
        field: new NumberField({ name: 'Number Field' }),
        value: '123',
      },
      {
        field: new ListField({
          name: 'List Field',
          values: [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })],
        }),
        value: 'Yes',
      },
      {
        field: new TimeSpanField({ name: 'Timespan Field' }),
        value: '1 Second(s)',
      },
    ] as { field: LayoutItem; value: string }[];

    const fields = importData.map(data => data.field);

    const recordToImport = importData.reduce(
      (acc, data) => {
        acc[data.field.name] = data.value;
        return acc;
      },
      {} as Record<string, string>
    );

    const dataToImport = [recordToImport];

    const dataImportName = FakeDataFactory.createFakeDataImportName();
    dataImportsToDelete.push(dataImportName);

    let importFilePath: string;

    await test.step('Create the fields to import data into', async () => {
      const appAdminPage = new AppAdminPage(sysAdminPage);
      await appAdminPage.goto(targetApp.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout();

      for (const [i, field] of fields.entries()) {
        await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(field);
        await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          sectionColumn: 0,
          sectionRow: i,
          fieldName: field.name,
        });
        await appAdminPage.layoutTab.layoutDesignerModal.saveLayout();
      }

      await appAdminPage.layoutTab.layoutDesignerModal.closeButton.click();
    });

    await test.step('Create the import file to be imported', () => {
      importFilePath = writeCsvFile(dataToImport);
      importFilesToDelete.push(importFilePath);
    });

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the data import to be updated', async () => {
      await adminHomePage.createImportConfig(dataImportName);
      await adminHomePage.page.waitForURL(editDataImportPage.pathRegex);
    });

    await test.step('Run the data import', async () => {
      await editDataImportPage.dataFileTab.selectTargetApp(targetApp.name);
      await editDataImportPage.dataFileTab.addImportFile(importFilePath);

      await editDataImportPage.dataMappingTabButton.click();

      const mappedFields = importData.map(data => data.field.name);

      for (const field of mappedFields) {
        const fieldMapping = editDataImportPage.dataMappingTab.getFieldMapping(field);

        const regex = new RegExp(field, 'i');
        await expect(fieldMapping.appField).toHaveText(regex);
        await expect(fieldMapping.mappedField).toHaveText(regex);
      }

      await editDataImportPage.saveAndRun();
    });

    await test.step('Verify the data import was run', async () => {
      await expect(editDataImportPage.importProcessingMessage).toBeVisible();

      await expect(async () => {
        const searchCriteria = [['TEXT', dataImportName]];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);

        const email = result.unwrap();
        expect(email.subject).toBe('Onspring Data Import Complete');

        if (email.html !== false) {
          // eslint-disable-next-line playwright/no-conditional-expect
          expect(email.html).toContain('New Content Created: 1');
        }
      }).toPass({
        intervals: [30_000],
        timeout: 300_000,
      });

      const viewContentPage = new ViewContentPage(sysAdminPage);
      await viewContentPage.goto(targetApp.id, 1);

      for (const { field, value } of importData) {
        const fieldComponent = await viewContentPage.form.getField({
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          fieldName: field.name,
          fieldType: field.type as FieldType,
        });

        await expect(fieldComponent).toBeVisible();
        await expect(fieldComponent).toHaveText(value);
      }
    });
  });
});
