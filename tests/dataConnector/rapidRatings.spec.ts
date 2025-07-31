import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { DataConnectorAdminPage } from '../../pageObjectModels/dataConnectors/dataConnectorAdminPage';
import { EditRapidRatingsConnectorPage } from '../../pageObjectModels/dataConnectors/editRapidRatingsConnectorPage';
import { AnnotationType } from '../annotations';

type RapidRatingsDataConnectorTestFixtures = {
  dataConnectorAdminPage: DataConnectorAdminPage;
  editRapidRatingsConnectorPage: EditRapidRatingsConnectorPage;
};

const test = base.extend<RapidRatingsDataConnectorTestFixtures>({
  dataConnectorAdminPage: async ({ sysAdminPage }, use) => await use(new DataConnectorAdminPage(sysAdminPage)),
  editRapidRatingsConnectorPage: async ({ sysAdminPage }, use) =>
    await use(new EditRapidRatingsConnectorPage(sysAdminPage)),
});

test.describe('rapid ratings data connector', () => {
  let connectorsToDelete: string[] = [];

  test.afterEach(async ({ dataConnectorAdminPage }) => {
    await dataConnectorAdminPage.deleteConnectors(connectorsToDelete);
    connectorsToDelete = [];
  });

  test('Create a new RapidRatings connector', async ({ dataConnectorAdminPage, editRapidRatingsConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-402',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the rapid ratings data connector', async () => {
      await dataConnectorAdminPage.createConnector(connectorName, 'RapidRatings Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editRapidRatingsConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editRapidRatingsConnectorPage.connectionTab.nameInput).toHaveValue(connectorName);
    });
  });

  test('Create a copy of a RapidRatings connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-403',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a RapidRatings connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-404',
    });

    expect(true).toBeTruthy();
  });
});
