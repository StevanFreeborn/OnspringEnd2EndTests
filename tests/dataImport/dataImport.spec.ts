import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { DataImportsAdminPage } from '../../pageObjectModels/dataImports/dataImportsAdminPage';
import { EditDataImportPage } from '../../pageObjectModels/dataImports/editDataImportPage';
import { AnnotationType } from '../annotations';

type DataImportTestFixtures = {
  adminHomePage: AdminHomePage;
  editDataImportPage: EditDataImportPage;
  dataImportsAdminPage: DataImportsAdminPage;
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
});

test.describe('data import', () => {
  let dataImportsToDelete: string[] = [];

  test.afterEach(async ({ dataImportsAdminPage }) => {
    await dataImportsAdminPage.deleteDataImports(dataImportsToDelete);
    dataImportsToDelete = [];
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
      await expect(editDataImportPage.nameInput).toHaveValue(dataImportName);
    });
  });

  test('Create a Data Import via the create button on the Integrations tile on the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-336',
    });

    expect(true).toBeTruthy();
  });

  test('Create a Data Import via the "Create Import Configuration" button on the data import home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-337',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a Data Import via the create button in the header of the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-338',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a Data Import via the create button on the Integrations tile on the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-339',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a Data Import via the "Create Import Configuration" button on the data import home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-340',
    });

    expect(true).toBeTruthy();
  });

  test('Update a Data Import', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-342',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a Data Import', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-343',
    });

    expect(true).toBeTruthy();
  });

  test('Run a Data Import', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-341',
    });

    expect(true).toBeTruthy();
  });
});
