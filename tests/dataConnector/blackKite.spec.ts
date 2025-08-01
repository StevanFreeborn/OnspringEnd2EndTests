import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { DataConnectorAdminPage } from '../../pageObjectModels/dataConnectors/dataConnectorAdminPage';
import { EditBlackKiteConnectorPage } from '../../pageObjectModels/dataConnectors/editBlackKiteConnectorPage';
import { AnnotationType } from '../annotations';

type BlackKiteDataConnectorTestFixtures = {
  dataConnectorAdminPage: DataConnectorAdminPage;
  editBlackKiteConnectorPage: EditBlackKiteConnectorPage;
};

const test = base.extend<BlackKiteDataConnectorTestFixtures>({
  dataConnectorAdminPage: async ({ sysAdminPage }, use) => await use(new DataConnectorAdminPage(sysAdminPage)),
  editBlackKiteConnectorPage: async ({ sysAdminPage }, use) => await use(new EditBlackKiteConnectorPage(sysAdminPage)),
});

test.describe('black kite data connector', () => {
  let connectorsToDelete: string[] = [];

  test.afterEach(async ({ dataConnectorAdminPage }) => {
    await dataConnectorAdminPage.deleteConnectors(connectorsToDelete);
    connectorsToDelete = [];
  });

  test('Create a new Black Kite connector', async ({ dataConnectorAdminPage, editBlackKiteConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-840',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the black kite data connector', async () => {
      await dataConnectorAdminPage.createConnector(connectorName, 'Black Kite Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editBlackKiteConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editBlackKiteConnectorPage.connectionTab.nameInput).toHaveValue(connectorName);
    });
  });

  test('Create a copy of a Black Kite connector', async ({ dataConnectorAdminPage, editBlackKiteConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-841',
    });

    const connectorToCopyName = FakeDataFactory.createFakeConnectorName();
    const connectorCopyName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorToCopyName, connectorCopyName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the black kite data connector to copy', async () => {
      await dataConnectorAdminPage.createConnector(connectorToCopyName, 'Black Kite Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editBlackKiteConnectorPage.pathRegex);
    });

    await test.step('Navigate back to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create a copy of the black site data connector', async () => {
      await dataConnectorAdminPage.copyConnector('Black Kite Data Connector', connectorToCopyName, connectorCopyName);
      await dataConnectorAdminPage.page.waitForURL(editBlackKiteConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editBlackKiteConnectorPage.connectionTab.nameInput).toHaveValue(connectorCopyName);
    });
  });

  test('Delete a Black Kite connector', async ({ dataConnectorAdminPage, editBlackKiteConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-842',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the data connector to delete', async () => {
      await dataConnectorAdminPage.createConnector(connectorName, 'Black Kite Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editBlackKiteConnectorPage.pathRegex);
    });

    await test.step('Navigate back to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Delete the data connector', async () => {
      await dataConnectorAdminPage.deleteConnector(connectorName);
    });

    await test.step('Verify the data connector has been deleted', async () => {
      const connectorRow = dataConnectorAdminPage.connectorsGrid.getByRole('row', { name: connectorName });

      await expect(connectorRow).toBeHidden();
    });
  });
});
