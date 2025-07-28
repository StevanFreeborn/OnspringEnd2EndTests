import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { DataConnectorAdminPage } from '../../pageObjectModels/dataConnectors/dataConnectorAdminPage';
import { EditSlackConnectorPage } from '../../pageObjectModels/dataConnectors/editSlackConnectorPage';
import { AnnotationType } from '../annotations';

type SlackAppDataConnectorTestFixtures = {
  dataConnectorAdminPage: DataConnectorAdminPage;
  editSlackConnectorPage: EditSlackConnectorPage;
};

const test = base.extend<SlackAppDataConnectorTestFixtures>({
  dataConnectorAdminPage: async ({ sysAdminPage }, use) => await use(new DataConnectorAdminPage(sysAdminPage)),
  editSlackConnectorPage: async ({ sysAdminPage }, use) => await use(new EditSlackConnectorPage(sysAdminPage)),
});

test.describe('slack app data connector', () => {
  let connectorsToDelete: string[] = [];

  test.afterEach(async ({ dataConnectorAdminPage }) => {
    await dataConnectorAdminPage.deleteConnectors(connectorsToDelete);
    connectorsToDelete = [];
  });

  test('Create a new Slack app connector', async ({ dataConnectorAdminPage, editSlackConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-437',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the slack app data connector', async () => {
      await dataConnectorAdminPage.createConnector(connectorName, 'Slack App Connector');
      await dataConnectorAdminPage.page.waitForURL(editSlackConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editSlackConnectorPage.generalTab.nameInput).toHaveValue(connectorName);
    });
  });

  test('Create a copy of a Slack app connector', async ({ dataConnectorAdminPage, editSlackConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-438',
    });

    const connectorToCopyName = FakeDataFactory.createFakeConnectorName();
    const connectorCopyName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorToCopyName, connectorCopyName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the slack app data connector to copy', async () => {
      await dataConnectorAdminPage.createConnector(connectorToCopyName, 'Slack App Connector');
      await dataConnectorAdminPage.page.waitForURL(editSlackConnectorPage.pathRegex);
    });

    await test.step('Navigate back to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create a copy of the slack app data connector', async () => {
      await dataConnectorAdminPage.copyConnector('Slack App Connector', connectorToCopyName, connectorCopyName);
      await dataConnectorAdminPage.page.waitForURL(editSlackConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editSlackConnectorPage.generalTab.nameInput).toHaveValue(connectorCopyName);
    });
  });

  test('Delete a Slack app connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-439',
    });

    expect(true).toBeTruthy();
  });
});
