import {
  App,
  BitsightAlertFieldMapping,
  BitsightAppMapping,
  BitsightDataConnector,
  BitsightPortfolioFieldMapping,
  BitsightRatingDetailsFieldMapping,
  FakeDataFactory,
  TextField,
} from '@stevanfreeborn/onspring-models';
import {
  AppTasks,
  DataConnectorsPageTargets,
  DataConnectorTasks,
  EditBitsightConnectorPageTargets,
  EditDataConnectorPageTargets,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { env } from '../../env';
import { AppFixture, test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type BitsightTestFixtures = {
  bitSightApiKey: string;
  alertsApp: App;
  portfolioApp: App;
  ratingDetailsApp: App;
};

const test = base.extend<BitsightTestFixtures>({
  bitSightApiKey: env.BITSIGHT_API_KEY,
  alertsApp: AppFixture.create().build(),
  portfolioApp: AppFixture.create().build(),
  ratingDetailsApp: AppFixture.create().build(),
});

test.describe('bitsight data connector', () => {
  let connectorsToDelete: string[] = [];

  test.afterEach(async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(DataConnectorTasks.deleteConnectors(connectorsToDelete));
    connectorsToDelete = [];
  });

  test('Create a new Bitsight connector', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-395',
    });

    const connectorName = FakeDataFactory.createFakeDataConnectorName();
    connectorsToDelete.push(connectorName);

    await test.step('Navigate to the admin page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create a new Bitsight data connector', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.createViaHeader(connectorName, 'BitSight Data Connector'));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Verify the new Bitsight connector is created', async () => {
      await sysAdminActor.browse().check(EditDataConnectorPageTargets.connectionTab.nameInput).hasValue(connectorName);
    });
  });

  test('Create a copy of a Bitsight connector', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-396',
    });

    const connectorToCopyName = FakeDataFactory.createFakeDataConnectorName();
    const connectorName = FakeDataFactory.createFakeDataConnectorName();
    connectorsToDelete.push(connectorToCopyName, connectorName);

    await test.step('Navigate to the admin page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create a Bitsight connector to copy', async () => {
      await sysAdminActor.attemptsTo(
        DataConnectorTasks.createViaHeader(connectorToCopyName, 'BitSight Data Connector')
      );
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Navigate back to the admin page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create a copy of the Bitsight connector', async () => {
      await sysAdminActor.attemptsTo(
        DataConnectorTasks.createCopyViaHeader('BitSight Data Connector', connectorToCopyName, connectorName)
      );
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Verify the copy of the Bitsight connector is created', async () => {
      await sysAdminActor.browse().check(EditDataConnectorPageTargets.connectionTab.nameInput).hasValue(connectorName);
    });
  });

  test('Delete a Bitsight connector', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-397',
    });

    const connectorName = FakeDataFactory.createFakeDataConnectorName();

    await test.step('Navigate to the admin page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the Bitsight connector to delete', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.createViaHeader(connectorName, 'BitSight Data Connector'));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Delete the Bitsight connector', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto(), DataConnectorTasks.delete(connectorName));
    });

    await test.step('Verify the Bitsight connector is deleted', async () => {
      await sysAdminActor.browse().check(DataConnectorsPageTargets.rowByName(connectorName)).isNotAttached();
    });
  });

  test('Configure a new Bitsight connector', async ({
    sysAdminActor,
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
        sysAdminActor,
        alertsApp,
        portfolioApp,
        ratingDetailsApp,
        alertIdField,
        companyIdField,
        ratingIdField,
      });
    });

    const dataConnector = new BitsightDataConnector({
      name: FakeDataFactory.createFakeDataConnectorName(),
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
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the Bitsight connector', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.createViaHeader(dataConnector.name, 'BitSight Data Connector'));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Configure the Bitsight connector', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.configureBitsight(dataConnector));
    });

    await test.step('Verify the Bitsight connector was configured', async () => {
      await sysAdminActor.browse().reload();

      await sysAdminActor
        .browse()
        .check(EditDataConnectorPageTargets.connectionTab.nameInput)
        .hasValue(dataConnector.name);
      await sysAdminActor
        .browse()
        .check(EditDataConnectorPageTargets.connectionTab.statusSwitch)
        .hasAttribute('aria-checked', 'false');
      await sysAdminActor
        .browse()
        .check(EditBitsightConnectorPageTargets.connectionTab.apiKeyInput)
        .doesNotHaveValue(dataConnector.apiKey);
    });
  });

  test('Verify a new Bitsight connector runs successfully', async ({
    sysAdminActor,
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
        sysAdminActor,
        alertsApp,
        portfolioApp,
        ratingDetailsApp,
        alertIdField,
        companyIdField,
        ratingIdField,
      });
    });

    const dataConnector = new BitsightDataConnector({
      name: FakeDataFactory.createFakeDataConnectorName(),
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
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the Bitsight connector', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.createViaHeader(dataConnector.name, 'BitSight Data Connector'));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Configure the Bitsight connector', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.configureBitsight(dataConnector));
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
  sysAdminActor,
  alertsApp,
  portfolioApp,
  ratingDetailsApp,
  alertIdField,
  companyIdField,
  ratingIdField,
}: {
  sysAdminActor: WebActor;
  alertsApp: App;
  portfolioApp: App;
  ratingDetailsApp: App;
  alertIdField: TextField;
  companyIdField: TextField;
  ratingIdField: TextField;
}) {
  await sysAdminActor.attemptsTo(AppTasks.gotoApp(alertsApp.id), AppTasks.addTextField(alertIdField.name));
  await sysAdminActor.attemptsTo(AppTasks.gotoApp(portfolioApp.id), AppTasks.addTextField(companyIdField.name));
  await sysAdminActor.attemptsTo(AppTasks.gotoApp(ratingDetailsApp.id), AppTasks.addTextField(ratingIdField.name));

  return { alertIdField, companyIdField, ratingIdField };
}
