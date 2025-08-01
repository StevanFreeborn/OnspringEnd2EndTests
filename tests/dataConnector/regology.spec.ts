import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { DataConnectorAdminPage } from '../../pageObjectModels/dataConnectors/dataConnectorAdminPage';
import { EditRegologyConnectorPage } from '../../pageObjectModels/dataConnectors/editRegologyConnectorPage';
import { AnnotationType } from '../annotations';

export type RegologyDataConnectorTestFixtures = {
  dataConnectorAdminPage: DataConnectorAdminPage;
  editRegologyConnectorPage: EditRegologyConnectorPage;
};

const test = base.extend<RegologyDataConnectorTestFixtures>({
  dataConnectorAdminPage: async ({ sysAdminPage }, use) => await use(new DataConnectorAdminPage(sysAdminPage)),
  editRegologyConnectorPage: async ({ sysAdminPage }, use) => await use(new EditRegologyConnectorPage(sysAdminPage)),
});

test.describe('regology data connector', () => {
  let connectorsToDelete: string[] = [];

  test.afterEach(async ({ dataConnectorAdminPage }) => {
    await dataConnectorAdminPage.deleteConnectors(connectorsToDelete);
    connectorsToDelete = [];
  });

  test('Create a new Regology connector', async ({ dataConnectorAdminPage, editRegologyConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-846',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the regology data connector', async () => {
      await dataConnectorAdminPage.createConnector(connectorName, 'Regology Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editRegologyConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editRegologyConnectorPage.connectionTab.nameInput).toHaveValue(connectorName);
    });
  });

  test('Create a copy of a Regology connector', async ({ dataConnectorAdminPage, editRegologyConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-847',
    });

    const connectorToCopyName = FakeDataFactory.createFakeConnectorName();
    const connectorCopyName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorToCopyName, connectorCopyName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the regology data connector to copy', async () => {
      await dataConnectorAdminPage.createConnector(connectorToCopyName, 'Regology Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editRegologyConnectorPage.pathRegex);
    });

    await test.step('Navigate back to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create a copy of the regology data connector', async () => {
      await dataConnectorAdminPage.copyConnector('Regology Data Connector', connectorToCopyName, connectorCopyName);
      await dataConnectorAdminPage.page.waitForURL(editRegologyConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editRegologyConnectorPage.connectionTab.nameInput).toHaveValue(connectorCopyName);
    });
  });

  test('Delete a Regology connector', async ({ dataConnectorAdminPage, editRegologyConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-848',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the data connector to delete', async () => {
      await dataConnectorAdminPage.createConnector(connectorName, 'Regology Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editRegologyConnectorPage.pathRegex);
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
