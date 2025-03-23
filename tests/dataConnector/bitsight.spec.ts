import { env } from '../../env';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import {
  BitsightAlertFieldMapping,
  BitsightAppMapping,
  BitsightDataConnector,
  BitsightPortfolioFieldMapping,
  BitsightRatingDetailsFieldMapping,
} from '../../models/bitsightDataConnector';
import { TextField } from '../../models/textField';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { DataConnectorAdminPage } from '../../pageObjectModels/dataConnectors/dataConnectorAdminPage';
import { EditBitsightConnectorPage } from '../../pageObjectModels/dataConnectors/editBitsightConnectorPage';
import { AnnotationType } from '../annotations';

type BitsightTestFixtures = {
  bitSightApiKey: string;
  appAdminPage: AppAdminPage;
  adminHomePage: AdminHomePage;
  editConnectorPage: EditBitsightConnectorPage;
  dataConnectorsAdminPage: DataConnectorAdminPage;
  alertsApp: App;
  portfolioApp: App;
  ratingDetailsApp: App;
};

const test = base.extend<BitsightTestFixtures>({
  bitSightApiKey: env.BITSIGHT_API_KEY,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  adminHomePage: async ({ sysAdminPage }, use) => await use(new AdminHomePage(sysAdminPage)),
  editConnectorPage: async ({ sysAdminPage }, use) => await use(new EditBitsightConnectorPage(sysAdminPage)),
  dataConnectorsAdminPage: async ({ sysAdminPage }, use) => await use(new DataConnectorAdminPage(sysAdminPage)),
  alertsApp: app,
  portfolioApp: app,
  ratingDetailsApp: app,
});

test.describe('bitsight data connector', () => {
  let connectorsToDelete: string[] = [];

  test.afterEach(async ({ dataConnectorsAdminPage }) => {
    await dataConnectorsAdminPage.deleteConnectors(connectorsToDelete);
    connectorsToDelete = [];
  });

  test('Create a new Bitsight connector', async ({ adminHomePage, editConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-395',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorName);

    await test.step('Navigate to the admin page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create a new Bitsight data connector', async () => {
      await adminHomePage.createConnectorUsingHeaderCreateButton(connectorName, 'BitSight Data Connector');
      await adminHomePage.page.waitForURL(editConnectorPage.pathRegex);
    });

    await test.step('Verify the new Bitsight connector is created', async () => {
      await expect(editConnectorPage.connectionTab.nameInput).toHaveValue(connectorName);
    });
  });

  test('Create a copy of a Bitsight connector', async ({ adminHomePage, editConnectorPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-396',
    });

    const connectorToCopyName = FakeDataFactory.createFakeConnectorName();
    const connectorName = FakeDataFactory.createFakeConnectorName();
    connectorsToDelete.push(connectorToCopyName, connectorName);

    await test.step('Navigate to the admin page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create a Bitsight connector to copy', async () => {
      await adminHomePage.createConnectorUsingHeaderCreateButton(connectorToCopyName, 'BitSight Data Connector');
      await adminHomePage.page.waitForURL(editConnectorPage.pathRegex);
    });

    await test.step('Navigate back to the admin page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create a copy of the Bitsight connector', async () => {
      await adminHomePage.createConnectorCopyUsingHeaderCreateButton(
        connectorToCopyName,
        connectorName,
        'BitSight Data Connector'
      );
      await adminHomePage.page.waitForURL(editConnectorPage.pathRegex);
    });

    await test.step('Verify the copy of the Bitsight connector is created', async () => {
      await expect(editConnectorPage.connectionTab.nameInput).toHaveValue(connectorName);
    });
  });

  test('Delete a Bitsight connector', async ({ adminHomePage, editConnectorPage, dataConnectorsAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-397',
    });

    const connectorName = FakeDataFactory.createFakeConnectorName();
    const connectorRow = dataConnectorsAdminPage.connectorsGrid.getByRole('row', { name: connectorName });

    await test.step('Navigate to the admin page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the Bitsight connector to delete', async () => {
      await adminHomePage.createConnectorUsingHeaderCreateButton(connectorName, 'BitSight Data Connector');
      await adminHomePage.page.waitForURL(editConnectorPage.pathRegex);
    });

    await test.step('Delete the Bitsight connector', async () => {
      await dataConnectorsAdminPage.goto();

      await connectorRow.hover();
      await connectorRow.getByTitle('Delete Data Connector').click();

      await dataConnectorsAdminPage.deleteConnectorDialog.deleteButton.click();
      await dataConnectorsAdminPage.deleteConnectorDialog.waitForDialogToBeDismissed();
    });

    await test.step('Verify the Bitsight connector is deleted', async () => {
      await expect(connectorRow).not.toBeAttached();
    });
  });

  test('Configure a new Bitsight connector', async ({
    appAdminPage,
    adminHomePage,
    editConnectorPage,
    alertsApp,
    portfolioApp,
    ratingDetailsApp,
    bitSightApiKey,
  }) => {
    test.slow();

    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-398',
    });

    const { alertIdField, companyIdField, ratingIdField } = getBitsightAppFields();

    await test.step('Setup the Bitsight apps', async () => {
      await setupBitsightApps({
        appAdminPage,
        alertsApp,
        portfolioApp,
        ratingDetailsApp,
        alertIdField,
        companyIdField,
        ratingIdField,
      });
    });

    const dataConnector = new BitsightDataConnector({
      name: FakeDataFactory.createFakeConnectorName(),
      status: false,
      apiKey: bitSightApiKey,
      startingOnDate: new Date(Date.now() + 1 * 60_000),
      frequency: 'Every Day',
      appMappings: new BitsightAppMapping({
        alertApp: {
          appName: alertsApp.name,
          mappings: new BitsightAlertFieldMapping({
            alertIdField: alertIdField.name,
          }),
        },
        portfolioApp: {
          appName: portfolioApp.name,
          mappings: new BitsightPortfolioFieldMapping({
            companyIdField: companyIdField.name,
          }),
        },
        ratingDetailsApp: {
          appName: ratingDetailsApp.name,
          mappings: new BitsightRatingDetailsFieldMapping({
            ratingIdField: ratingIdField.name,
          }),
        },
      }),
    });

    connectorsToDelete.push(dataConnector.name);

    await test.step('Navigate to the admin page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the Bitsight connector', async () => {
      await adminHomePage.createConnectorUsingHeaderCreateButton(dataConnector.name, 'BitSight Data Connector');
      await adminHomePage.page.waitForURL(editConnectorPage.pathRegex);
    });

    await test.step('Configure the Bitsight connector', async () => {
      await editConnectorPage.updateConnector(dataConnector);
    });

    await test.step('Verify the Bitsight connector was configured', async () => {
      await editConnectorPage.page.reload();

      await expect(editConnectorPage.connectionTab.nameInput).toHaveValue(dataConnector.name);
      await expect(editConnectorPage.connectionTab.statusSwitch).toHaveAttribute('aria-checked', 'false');
      await expect(editConnectorPage.connectionTab.apiKeyInput).toHaveValue(dataConnector.apiKey);
    });
  });

  test('Verify a new Bitsight connector runs successfully', async ({
    appAdminPage,
    adminHomePage,
    editConnectorPage,
    alertsApp,
    portfolioApp,
    ratingDetailsApp,
    bitSightApiKey,
    sysAdminEmail,
    sysAdminUser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-399',
    });

    test.slow();

    const { alertIdField, companyIdField, ratingIdField } = getBitsightAppFields();

    await test.step('Setup the Bitsight apps', async () => {
      await setupBitsightApps({
        appAdminPage,
        alertsApp,
        portfolioApp,
        ratingDetailsApp,
        alertIdField,
        companyIdField,
        ratingIdField,
      });
    });

    const dataConnector = new BitsightDataConnector({
      name: FakeDataFactory.createFakeConnectorName(),
      status: true,
      apiKey: bitSightApiKey,
      startingOnDate: new Date(Date.now() + 2 * 60_000),
      frequency: 'Every Day',
      appMappings: new BitsightAppMapping({
        alertApp: {
          appName: alertsApp.name,
          mappings: new BitsightAlertFieldMapping({
            alertIdField: alertIdField.name,
          }),
        },
        portfolioApp: {
          appName: portfolioApp.name,
          mappings: new BitsightPortfolioFieldMapping({
            companyIdField: companyIdField.name,
          }),
        },
        ratingDetailsApp: {
          appName: ratingDetailsApp.name,
          mappings: new BitsightRatingDetailsFieldMapping({
            ratingIdField: ratingIdField.name,
          }),
        },
      }),
      notificationUsers: [sysAdminUser.fullName],
    });

    connectorsToDelete.push(dataConnector.name);

    await test.step('Navigate to the admin page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the Bitsight connector', async () => {
      await adminHomePage.createConnectorUsingHeaderCreateButton(dataConnector.name, 'BitSight Data Connector');
      await adminHomePage.page.waitForURL(editConnectorPage.pathRegex);
    });

    await test.step('Configure the Bitsight connector', async () => {
      await editConnectorPage.updateConnector(dataConnector);
    });

    await test.step('Verify the Bitsight connector runs successfully', async () => {
      await expect(async () => {
        const searchCriteria = [
          ['SUBJECT', 'Onspring Data Connector Complete'],
          ['TEXT', dataConnector.name],
          ['UNSEEN'],
        ];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);
      }).toPass({
        intervals: [120_000, 30_000],
        timeout: 600_000,
      });
    });
  });
});

function getBitsightAppFields() {
  const alertIdField = new TextField({
    name: FakeDataFactory.createFakeFieldName(),
  });

  const companyIdField = new TextField({
    name: FakeDataFactory.createFakeFieldName(),
  });

  const ratingIdField = new TextField({
    name: FakeDataFactory.createFakeFieldName(),
  });

  return { alertIdField, companyIdField, ratingIdField };
}

async function setupBitsightApps({
  appAdminPage,
  alertsApp,
  portfolioApp,
  ratingDetailsApp,
  alertIdField,
  companyIdField,
  ratingIdField,
}: {
  appAdminPage: AppAdminPage;
  alertsApp: App;
  portfolioApp: App;
  ratingDetailsApp: App;
  alertIdField: TextField;
  companyIdField: TextField;
  ratingIdField: TextField;
}) {
  await appAdminPage.goto(alertsApp.id);
  await appAdminPage.layoutTabButton.click();
  await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(alertIdField);

  await appAdminPage.goto(portfolioApp.id);
  await appAdminPage.layoutTabButton.click();
  await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(companyIdField);

  await appAdminPage.goto(ratingDetailsApp.id);
  await appAdminPage.layoutTabButton.click();
  await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(ratingIdField);

  return { alertIdField, companyIdField, ratingIdField };
}
