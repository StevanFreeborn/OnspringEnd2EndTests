import { FieldType } from '../../componentObjectModels/menus/addFieldTypeMenu';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { writeCsvFile } from '../../fixtures/file.fixtures';
import { App } from '../../models/app';
import { SecureFileDataConnector } from '../../models/secureFileDataConnector';
import { TextField } from '../../models/textField';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { ViewContentPage } from '../../pageObjectModels/content/viewContentPage';
import { DataConnectorAdminPage } from '../../pageObjectModels/dataConnectors/dataConnectorAdminPage';
import { EditSecureFileDataConnectorPage } from '../../pageObjectModels/dataConnectors/editSecureFileDataConnectorPage';
import { AnnotationType } from '../annotations';

type SecureFileDataConnectorTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
  dataConnectorsAdminPage: DataConnectorAdminPage;
  editConnectorPage: EditSecureFileDataConnectorPage;
  viewContentPage: ViewContentPage;
};

const test = base.extend<SecureFileDataConnectorTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  dataConnectorsAdminPage: async ({ sysAdminPage }, use) => await use(new DataConnectorAdminPage(sysAdminPage)),
  editConnectorPage: async ({ sysAdminPage }, use) => await use(new EditSecureFileDataConnectorPage(sysAdminPage)),
  viewContentPage: async ({ sysAdminPage }, use) => await use(new ViewContentPage(sysAdminPage)),
});

test.describe('secure file data connector', () => {
  let connectorsToDelete: string[] = [];

  test.afterEach(async ({ dataConnectorsAdminPage }) => {
    await dataConnectorsAdminPage.deleteConnectors(connectorsToDelete);
    connectorsToDelete = [];
  });

  test('Create a new Secure File connector', async ({ dataConnectorsAdminPage, editConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-430',
    });

    const dataConnectorName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(dataConnectorName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorsAdminPage.goto();
    });

    await test.step('Create a new secure file connector', async () => {
      await dataConnectorsAdminPage.createConnector(dataConnectorName, 'Secure File Data Connector');
      await dataConnectorsAdminPage.page.waitForURL(editConnectorPage.pathRegex);
    });

    await test.step('Verify the secure file connector is created successfully', async () => {
      await expect(editConnectorPage.connectionTab.nameInput).toHaveValue(dataConnectorName);
    });
  });

  test('Create a copy of a Secure File connector', async ({ dataConnectorsAdminPage, editConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-431',
    });

    const connectorToCopy = FakeDataFactory.createFakeConnectorName();
    const dataConnectorName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorToCopy, dataConnectorName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorsAdminPage.goto();
    });

    await test.step('Create the secure file connector to copy', async () => {
      await dataConnectorsAdminPage.createConnector(connectorToCopy, 'Secure File Data Connector');
      await dataConnectorsAdminPage.page.waitForURL(editConnectorPage.pathRegex);
    });

    await test.step('Navigate back to the data connectors admin page', async () => {
      await dataConnectorsAdminPage.goto();
    });

    await test.step('Copy the secure file connector', async () => {
      await dataConnectorsAdminPage.copyConnector('Secure File Data Connector', connectorToCopy, dataConnectorName);
      await dataConnectorsAdminPage.page.waitForURL(editConnectorPage.pathRegex);
    });

    await test.step('Verify the secure file connector copy is created successfully', async () => {
      await expect(editConnectorPage.connectionTab.nameInput).toHaveValue(dataConnectorName);
    });
  });

  test('Delete a Secure File connector', async ({ dataConnectorsAdminPage, editConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-432',
    });

    const dataConnectorName = FakeDataFactory.createFakeConnectorName();

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorsAdminPage.goto();
    });

    await test.step('Create the secure file connector to delete', async () => {
      await dataConnectorsAdminPage.createConnector(dataConnectorName, 'Secure File Data Connector');
      await dataConnectorsAdminPage.page.waitForURL(editConnectorPage.pathRegex);
    });

    await test.step('Navigate back to the data connectors admin page', async () => {
      await dataConnectorsAdminPage.goto();
    });

    await test.step('Delete the secure file connector', async () => {
      await dataConnectorsAdminPage.deleteConnector(dataConnectorName);
    });

    await test.step('Verify the secure file connector is deleted successfully', async () => {
      const connectorRow = dataConnectorsAdminPage.connectorsGrid.getByRole('row', { name: dataConnectorName });
      await expect(connectorRow).toBeHidden();
    });
  });

  test('Configure a new Secure File connector', async ({
    app,
    appAdminPage,
    dataConnectorsAdminPage,
    editConnectorPage,
    sftpService,
    sysAdminUser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-433',
    });

    const textField = new TextField({
      name: FakeDataFactory.createFakeFieldName(),
    });

    const dataConnector = new SecureFileDataConnector({
      name: FakeDataFactory.createFakeConnectorName(),
      status: true,
      app: app.name,
      hostname: sftpService.hostname(),
      port: sftpService.port(),
      fileLocation: './',
      fileName: `${FakeDataFactory.createUniqueIdentifier()}.csv`,
      fileType: 'CSV (Comma delimited)',
      authType: {
        type: 'Username / Password',
        username: sftpService.username(),
        password: sftpService.password(),
      },
      startingOnDate: new Date(Date.now() + 10 * 60_000),
      frequency: 'Every Day',
      notificationUsers: [sysAdminUser.fullName],
    });

    connectorsToDelete.push(dataConnector.name);

    await test.step('Navigate to app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Add text field for field mappings', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textField);
    });

    await test.step('Upload csv to be imported', async () => {
      const sourcePath = writeCsvFile([{ [textField.name]: 'Text Field Value' }]);
      await sftpService.uploadFile(sourcePath, dataConnector.filePath());
    });

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorsAdminPage.goto();
    });

    await test.step('Create a new secure file connector', async () => {
      await dataConnectorsAdminPage.createConnector(dataConnector.name, 'Secure File Data Connector');
      await dataConnectorsAdminPage.page.waitForURL(editConnectorPage.pathRegex);
    });

    await test.step('Configure the secure file connector', async () => {
      await editConnectorPage.updateConnector(dataConnector);
    });

    await test.step('Verify the secure file connector is configured successfully', async () => {
      await dataConnectorsAdminPage.goto();

      const dataConnectorRow = dataConnectorsAdminPage.connectorsGrid.getByRole('row', {
        name: new RegExp(dataConnector.name),
      });

      await expect(dataConnectorRow).toBeVisible();
      await expect(dataConnectorRow).toHaveText(/enabled/i);
    });

    await test.step('Remove the uploaded file from SFTP server', async () => {
      await sftpService.deleteFile(dataConnector.filePath());
    });
  });

  test('Verify a new Secure File connector runs successfully', async ({
    app,
    appAdminPage,
    dataConnectorsAdminPage,
    editConnectorPage,
    sftpService,
    sysAdminUser,
    sysAdminEmail,
    viewContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-434',
    });

    test.slow();

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const textFieldValue = 'Text Field Value';
    const textField = new TextField({
      name: FakeDataFactory.createFakeFieldName(),
    });

    const dataConnector = new SecureFileDataConnector({
      name: FakeDataFactory.createFakeConnectorName(),
      status: true,
      app: app.name,
      hostname: sftpService.hostname(),
      port: sftpService.port(),
      fileLocation: './',
      fileName: `${FakeDataFactory.createUniqueIdentifier()}.csv`,
      fileType: 'CSV (Comma delimited)',
      authType: {
        type: 'Username / Password',
        username: sftpService.username(),
        password: sftpService.password(),
      },
      startingOnDate: new Date(Date.now() + 2 * 60_000),
      frequency: 'Every Day',
      notificationUsers: [sysAdminUser.fullName],
    });

    connectorsToDelete.push(dataConnector.name);

    await test.step('Navigate to app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Add text field for field mappings', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(textField);
      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: tabName,
        sectionName: sectionName,
        sectionRow: 0,
        sectionColumn: 0,
        fieldName: textField.name,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Upload csv to be imported', async () => {
      const sourcePath = writeCsvFile([{ [textField.name]: 'Text Field Value' }]);
      await sftpService.uploadFile(sourcePath, dataConnector.filePath());
    });

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorsAdminPage.goto();
    });

    await test.step('Create a new secure file connector', async () => {
      await dataConnectorsAdminPage.createConnector(dataConnector.name, 'Secure File Data Connector');
      await dataConnectorsAdminPage.page.waitForURL(editConnectorPage.pathRegex);
    });

    await test.step('Configure the secure file connector', async () => {
      await editConnectorPage.updateConnector(dataConnector);
    });

    await test.step('Verify the secure file connector is run', async () => {
      await expect(async () => {
        const searchCriteria = [['TEXT', dataConnector.name]];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);

        const email = result.unwrap();
        expect(email.subject).toBe('Onspring Data Connector Complete');
      }).toPass({
        intervals: [30_000],
        timeout: 300_000,
      });

      await viewContentPage.goto(app.id, 1);

      const field = await viewContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: textField.name,
        fieldType: textField.type as FieldType,
      });

      await expect(field).toHaveText(textFieldValue);
    });

    await test.step('Remove the uploaded file from SFTP server', async () => {
      await sftpService.deleteFile(dataConnector.filePath());
    });
  });
});
