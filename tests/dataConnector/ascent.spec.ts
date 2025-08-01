import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { DataConnectorAdminPage } from '../../pageObjectModels/dataConnectors/dataConnectorAdminPage';
import { EditAscentConnectorPage } from '../../pageObjectModels/dataConnectors/editAscendConnectorPage';
import { AnnotationType } from '../annotations';

type AscentDataConnectorTestFixtures = {
  dataConnectorAdminPage: DataConnectorAdminPage;
  editAscentConnectorPage: EditAscentConnectorPage;
};

const test = base.extend<AscentDataConnectorTestFixtures>({
  dataConnectorAdminPage: async ({ sysAdminPage }, use) => await use(new DataConnectorAdminPage(sysAdminPage)),
  editAscentConnectorPage: async ({ sysAdminPage }, use) => await use(new EditAscentConnectorPage(sysAdminPage)),
});

test.describe('ascent data connector', () => {
  let connectorsToDelete: string[] = [];

  test.afterEach(async ({ dataConnectorAdminPage }) => {
    await dataConnectorAdminPage.deleteConnectors(connectorsToDelete);
    connectorsToDelete = [];
  });

  test('Create a new Ascent connector', async ({ dataConnectorAdminPage, editAscentConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-834',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the ascent data connector', async () => {
      await dataConnectorAdminPage.createConnector(connectorName, 'Ascent Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editAscentConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editAscentConnectorPage.connectionTab.nameInput).toHaveValue(connectorName);
    });
  });

  test('Create a copy of an Ascent Data Connector', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-835',
    });

    expect(true).toBeTruthy();
  });

  test('Delete an Ascent Data Connector', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-836',
    });

    expect(true).toBeTruthy();
  });
});
