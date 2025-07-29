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

  test('Create a copy of a Risk Recon connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-389',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a Risk Recon connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-390',
    });

    expect(true).toBeTruthy();
  });
});
