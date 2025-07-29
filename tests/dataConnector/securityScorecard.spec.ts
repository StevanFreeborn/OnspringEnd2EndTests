import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { DataConnectorAdminPage } from '../../pageObjectModels/dataConnectors/dataConnectorAdminPage';
import { EditSecurityScorecardConnectorPage } from '../../pageObjectModels/dataConnectors/editSecurityScorecardConnectorPage';
import { AnnotationType } from '../annotations';

type SecurityScorecardDataConnectorTestFixtures = {
  dataConnectorAdminPage: DataConnectorAdminPage;
  editSecurityScorecardConnectorPage: EditSecurityScorecardConnectorPage;
};

const test = base.extend<SecurityScorecardDataConnectorTestFixtures>({
  dataConnectorAdminPage: async ({ sysAdminPage }, use) => await use(new DataConnectorAdminPage(sysAdminPage)),
  editSecurityScorecardConnectorPage: async ({ sysAdminPage }, use) =>
    await use(new EditSecurityScorecardConnectorPage(sysAdminPage)),
});

test.describe('security scorecard data connector', () => {
  let connectorsToDelete: string[] = [];

  test.afterEach(async ({ dataConnectorAdminPage }) => {
    await dataConnectorAdminPage.deleteConnectors(connectorsToDelete);
    connectorsToDelete = [];
  });

  test('Create a new Security Scorecard connector', async ({
    dataConnectorAdminPage,
    editSecurityScorecardConnectorPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-409',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the security scorecard data connector', async () => {
      await dataConnectorAdminPage.createConnector(connectorName, 'Security Scorecard Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editSecurityScorecardConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editSecurityScorecardConnectorPage.connectionTab.nameInput).toHaveValue(connectorName);
    });
  });

  test('Create a copy of a Security Scorecard connector', async ({
    dataConnectorAdminPage,
    editSecurityScorecardConnectorPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-410',
    });

    const connectorToCopyName = FakeDataFactory.createFakeConnectorName();
    const connectorCopyName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorToCopyName, connectorCopyName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the security scorecard data connector to copy', async () => {
      await dataConnectorAdminPage.createConnector(connectorToCopyName, 'Security Scorecard Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editSecurityScorecardConnectorPage.pathRegex);
    });

    await test.step('Navigate back to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create a copy of the security scorecard data connector', async () => {
      await dataConnectorAdminPage.copyConnector(
        'Security Scorecard Data Connector',
        connectorToCopyName,
        connectorCopyName
      );
      await dataConnectorAdminPage.page.waitForURL(editSecurityScorecardConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editSecurityScorecardConnectorPage.connectionTab.nameInput).toHaveValue(connectorCopyName);
    });
  });

  test('Delete a Security Scorecard connector', async ({
    dataConnectorAdminPage,
    editSecurityScorecardConnectorPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-411',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the data connector to delete', async () => {
      await dataConnectorAdminPage.createConnector(connectorName, 'Security Scorecard Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editSecurityScorecardConnectorPage.pathRegex);
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
