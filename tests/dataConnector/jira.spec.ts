import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { DataConnectorAdminPage } from '../../pageObjectModels/dataConnectors/dataConnectorAdminPage';
import { EditJiraConnectorPage } from '../../pageObjectModels/dataConnectors/editJiraConnectorPage';
import { AnnotationType } from '../annotations';

type JiraDataConnectorTestFixtures = {
  dataConnectorAdminPage: DataConnectorAdminPage;
  editJiraConnectorPage: EditJiraConnectorPage;
};

const test = base.extend<JiraDataConnectorTestFixtures>({
  dataConnectorAdminPage: async ({ sysAdminPage }, use) => await use(new DataConnectorAdminPage(sysAdminPage)),
  editJiraConnectorPage: async ({ sysAdminPage }, use) => await use(new EditJiraConnectorPage(sysAdminPage)),
});

test.describe('jira data connector', () => {
  let connectorsToDelete: string[] = [];

  test.afterEach(async ({ dataConnectorAdminPage }) => {
    await dataConnectorAdminPage.deleteConnectors(connectorsToDelete);
    connectorsToDelete = [];
  });

  test('Create a new Jira connector', async ({ dataConnectorAdminPage, editJiraConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-416',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the jira data connector', async () => {
      await dataConnectorAdminPage.createConnector(connectorName, 'Jira Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editJiraConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editJiraConnectorPage.connectionTab.nameInput).toHaveValue(connectorName);
    });
  });

  test('Create a copy of a Jira connector', async ({ dataConnectorAdminPage, editJiraConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-417',
    });

    const connectorToCopyName = FakeDataFactory.createFakeConnectorName();
    const connectorCopyName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorToCopyName, connectorCopyName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the jira data connector to copy', async () => {
      await dataConnectorAdminPage.createConnector(connectorToCopyName, 'Jira Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editJiraConnectorPage.pathRegex);
    });

    await test.step('Navigate back to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create a copy of the jira data connector', async () => {
      await dataConnectorAdminPage.copyConnector('Jira Data Connector', connectorToCopyName, connectorCopyName);
      await dataConnectorAdminPage.page.waitForURL(editJiraConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editJiraConnectorPage.connectionTab.nameInput).toHaveValue(connectorCopyName);
    });
  });

  test('Delete a Jira connector', async ({ dataConnectorAdminPage, editJiraConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-418',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();

    await test.step('Navigate to the data connectors admin page', async () => {
      await dataConnectorAdminPage.goto();
    });

    await test.step('Create the data connector to delete', async () => {
      await dataConnectorAdminPage.createConnector(connectorName, 'Jira Data Connector');
      await dataConnectorAdminPage.page.waitForURL(editJiraConnectorPage.pathRegex);
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
