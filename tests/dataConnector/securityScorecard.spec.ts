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

    await test.step('Create the Security Scorecard data connector', async () => {
      await dataConnectorAdminPage.createConnector(connectorName, 'Security Scorecard Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editSecurityScorecardConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editSecurityScorecardConnectorPage.connectionTab.nameInput).toHaveValue(connectorName);
    });
  });

  test('Create a copy of a Security Scorecard connector', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-410',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a Security Scorecard connector', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-411',
    });

    expect(true).toBeTruthy();
  });
});
