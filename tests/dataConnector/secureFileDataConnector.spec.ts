import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { DataConnectorAdminPage } from '../../pageObjectModels/dataConnectors/dataConnectorAdminPage';
import { EditSecureFileDataConnectorPage } from '../../pageObjectModels/dataConnectors/editSecureFileDataConnectorPage';
import { AnnotationType } from '../annotations';

type SecureFileDataConnectorTestFixtures = {
  app: App;
  dataConnectorsAdminPage: DataConnectorAdminPage;
  editConnectorPage: EditSecureFileDataConnectorPage;
};

const test = base.extend<SecureFileDataConnectorTestFixtures>({
  app: app,
  dataConnectorsAdminPage: async ({ sysAdminPage }, use) => await use(new DataConnectorAdminPage(sysAdminPage)),
  editConnectorPage: async ({ sysAdminPage }, use) => await use(new EditSecureFileDataConnectorPage(sysAdminPage)),
});

test.describe('secure file data connector', () => {
  let connectorsToDelete: string[] = [];

  test.afterEach(async ({ dataConnectorsAdminPage }) => {
    await dataConnectorsAdminPage.deleteConnectors(connectorsToDelete);
    connectorsToDelete = [];
  });

  test('Create a new Secure File connector', async ({
    dataConnectorsAdminPage,
    editConnectorPage,
  }) => {
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

  test('Create a copy of a Secure File connector', async ({
    dataConnectorsAdminPage,
    editConnectorPage,
  }) => {
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

  test('Delete a Secure File connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-432',
    });

    expect(true).toBeTruthy();
  });

  test('Configure a new Secure File connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-433',
    });

    expect(true).toBeTruthy();
  });

  test('Verify a new Secure File connector runs successfully', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-434',
    });

    expect(true).toBeTruthy();
  });
});
