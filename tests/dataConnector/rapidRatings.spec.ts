import { FakeDataFactory } from '@stevanfreeborn/onspring-models';
import {
  DataConnectorsPageTargets,
  DataConnectorTasks,
  EditDataConnectorPageTargets,
} from '@stevanfreeborn/onspring-ui';
import { test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('rapid ratings data connector', () => {
  let connectorsToDelete: string[] = [];

  test.afterEach(async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(DataConnectorTasks.deleteConnectors(connectorsToDelete));
    connectorsToDelete = [];
  });

  test('Create a new RapidRatings connector', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-402',
    });

    const connectorName = FakeDataFactory.createFakeDataConnectorName();
    connectorsToDelete.push(connectorName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto());
    });

    await test.step('Create the rapid ratings data connector', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.create(connectorName, 'RapidRatings Data Connector'));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await sysAdminActor.browse().check(EditDataConnectorPageTargets.connectionTab.nameInput).hasValue(connectorName);
    });
  });

  test('Create a copy of a RapidRatings connector', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-403',
    });

    const connectorToCopyName = FakeDataFactory.createFakeDataConnectorName();
    const connectorCopyName = FakeDataFactory.createFakeDataConnectorName();
    connectorsToDelete.push(connectorToCopyName, connectorCopyName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto());
    });

    await test.step('Create the rapid ratings data connector to copy', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.create(connectorToCopyName, 'RapidRatings Data Connector'));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Navigate back to the data connectors admin page', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto());
    });

    await test.step('Create a copy of the rapid ratings data connector', async () => {
      await sysAdminActor.attemptsTo(
        DataConnectorTasks.createCopy('RapidRatings Data Connector', connectorToCopyName, connectorCopyName)
      );
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await sysAdminActor
        .browse()
        .check(EditDataConnectorPageTargets.connectionTab.nameInput)
        .hasValue(connectorCopyName);
    });
  });

  test('Delete a RapidRatings connector', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-404',
    });

    const connectorName = FakeDataFactory.createFakeDataConnectorName();

    await test.step('Navigate to the data connectors admin page', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto());
    });

    await test.step('Create the data connector to delete', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.create(connectorName, 'RapidRatings Data Connector'));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Navigate back to the data connectors admin page', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto());
    });

    await test.step('Delete the data connector', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.delete(connectorName));
    });

    await test.step('Verify the data connector has been deleted', async () => {
      await sysAdminActor.browse().check(DataConnectorsPageTargets.rowByName(connectorName)).isHidden();
    });
  });
});
