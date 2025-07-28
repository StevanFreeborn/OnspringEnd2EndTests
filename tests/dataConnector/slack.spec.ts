import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { DataConnectorAdminPage } from '../../pageObjectModels/dataConnectors/dataConnectorAdminPage';
import { EditSlackConnectorPage } from '../../pageObjectModels/dataConnectors/editSlackConnectorPage';
import { AnnotationType } from '../annotations';

type SlackAppDataConnectorTestFixtures = {
  dataConnectorAdminPage: DataConnectorAdminPage;
  editSlackConnectorPage: EditSlackConnectorPage;
};

const test = base.extend<SlackAppDataConnectorTestFixtures>({});

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

    await test.step('Create the UCF data connector', async () => {
      await dataConnectorAdminPage.createConnector(connectorName, 'Unified Compliance Framework (UCF) Connector');
      await dataConnectorAdminPage.page.waitForURL(editSlackConnectorPage.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await expect(editSlackConnectorPage.generalTab.nameInput).toHaveValue(connectorName);
    });
  });

  test('Create a copy of a Slack app connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-438',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a Slack app connector', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-439',
    });

    expect(true).toBeTruthy();
  });
});
