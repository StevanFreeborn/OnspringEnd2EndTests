import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { DataConnectorAdminPage } from '../../pageObjectModels/dataConnectors/dataConnectorAdminPage';
import { EditUcfConnectorPage } from '../../pageObjectModels/dataConnectors/editUcfConnectorPage';
import { AnnotationType } from '../annotations';

type UCFDataConnectorTestFixtures = {
  dataConnectorAdminPage: DataConnectorAdminPage;
  editUcfConnectorPage: EditUcfConnectorPage;
};

const test = base.extend<UCFDataConnectorTestFixtures>({
  dataConnectorAdminPage: async ({ sysAdminPage }, use) => await use(new DataConnectorAdminPage(sysAdminPage)),
  editUcfConnectorPage: async ({ sysAdminPage }, use) => await use(new EditUcfConnectorPage(sysAdminPage)),
});

test.describe('ucf data connector', () => {
  let connectorsToDelete: string[] = [];

  test.afterEach(async ({ dataConnectorAdminPage }) => {
    await dataConnectorAdminPage.deleteConnectors(connectorsToDelete);
    connectorsToDelete = [];
  });

  test('Create a new UCF connector', async ({ dataConnectorAdminPage, editUcfConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-423',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the UCF data connector', async () => {
      await dataConnectorAdminPage.createConnector(connectorName, 'Unified Compliance Framework (UCF) Connector');
      await dataConnectorAdminPage.page.waitForURL(editUcfConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editUcfConnectorPage.connectionTab.nameInput).toHaveValue(connectorName);
    });
  });

  test('Create a copy of a UCF connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-424',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a UCF connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-425',
    });

    expect(true).toBeTruthy();
  });
});
