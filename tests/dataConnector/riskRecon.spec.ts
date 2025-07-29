import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { DataConnectorAdminPage } from '../../pageObjectModels/dataConnectors/dataConnectorAdminPage';
import { EditRiskReconConnectorPage } from '../../pageObjectModels/dataConnectors/editRiskReconConnectorPage';
import { AnnotationType } from '../annotations';

type RiskReconDataConnectorTestFixtures = {
  dataConnectorAdminPage: DataConnectorAdminPage;
  editRiskReconConnectorPage: EditRiskReconConnectorPage;
};

const test = base.extend<RiskReconDataConnectorTestFixtures>({
  dataConnectorAdminPage: async ({ sysAdminPage }, use) => await use(new DataConnectorAdminPage(sysAdminPage)),
  editRiskReconConnectorPage: async ({ sysAdminPage }, use) => await use(new EditRiskReconConnectorPage(sysAdminPage)),
});

test.describe('risk recon data connector', () => {
  let connectorsToDelete: string[] = [];

  test.afterEach(async ({ dataConnectorAdminPage }) => {
    await dataConnectorAdminPage.deleteConnectors(connectorsToDelete);
    connectorsToDelete = [];
  });

  test('Create a new Risk Recon connector', async ({ dataConnectorAdminPage, editRiskReconConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-388',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the risk recon data connector', async () => {
      await dataConnectorAdminPage.createConnector(connectorName, 'Risk Recon Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editRiskReconConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editRiskReconConnectorPage.connectionTab.nameInput).toHaveValue(connectorName);
    });
  });

  test('Create a copy of a Risk Recon connector', async ({ dataConnectorAdminPage, editRiskReconConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-389',
    });

    const connectorToCopyName = FakeDataFactory.createFakeConnectorName();
    const connectorCopyName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorToCopyName, connectorCopyName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the risk recon data connector to copy', async () => {
      await dataConnectorAdminPage.createConnector(connectorToCopyName, 'Risk Recon Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editRiskReconConnectorPage.pathRegex);
    });

    await test.step('Navigate back to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create a copy of the risk recon data connector', async () => {
      await dataConnectorAdminPage.copyConnector('Risk Recon Data Connector', connectorToCopyName, connectorCopyName);
      await dataConnectorAdminPage.page.waitForURL(editRiskReconConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editRiskReconConnectorPage.connectionTab.nameInput).toHaveValue(connectorCopyName);
    });
  });

  test('Delete a Risk Recon connector', async ({ dataConnectorAdminPage, editRiskReconConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-390',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the data connector to delete', async () => {
      await dataConnectorAdminPage.createConnector(connectorName, 'Risk Recon Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editRiskReconConnectorPage.pathRegex);
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
