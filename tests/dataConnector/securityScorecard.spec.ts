import { FakeDataFactory } from '@stevanfreeborn/onspring-models';
import {
  DataConnectorsPageTargets,
  DataConnectorTasks,
  EditDataConnectorPageTargets,
} from '@stevanfreeborn/onspring-ui';
import { test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('security scorecard data connector', () => {
  let connectorsToDelete: string[] = [];

  test.afterEach(async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(DataConnectorTasks.deleteConnectors(connectorsToDelete));
    connectorsToDelete = [];
  });

  test('Create a new Security Scorecard connector', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-409',
    });

    const connectorName = FakeDataFactory.createFakeDataConnectorName();
    connectorsToDelete.push(connectorName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto());
    });

    await test.step('Create the security scorecard data connector', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.create(connectorName, 'Security Scorecard Data Connector'));
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Verify the data connector was created successfully', async () => {
      await sysAdminActor.browse().check(EditDataConnectorPageTargets.connectionTab.nameInput).hasValue(connectorName);
    });
  });

  test('Create a copy of a Security Scorecard connector', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-410',
    });

    const connectorToCopyName = FakeDataFactory.createFakeDataConnectorName();
    const connectorCopyName = FakeDataFactory.createFakeDataConnectorName();
    connectorsToDelete.push(connectorToCopyName, connectorCopyName);

    await test.step('Navigate to the data connectors admin page', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto());
    });

    await test.step('Create the security scorecard data connector to copy', async () => {
      await sysAdminActor.attemptsTo(
        DataConnectorTasks.create(connectorToCopyName, 'Security Scorecard Data Connector')
      );
      await sysAdminActor.browse().checkPage().hasUrl(EditDataConnectorPageTargets.pathRegex);
    });

    await test.step('Navigate back to the data connectors admin page', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto());
    });

    await test.step('Create a copy of the security scorecard data connector', async () => {
      await sysAdminActor.attemptsTo(
        DataConnectorTasks.createCopy('Security Scorecard Data Connector', connectorToCopyName, connectorCopyName)
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

  test('Delete a Security Scorecard connector', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-411',
    });

    const connectorName = FakeDataFactory.createFakeDataConnectorName();

    await test.step('Navigate to the data connectors admin page', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.goto());
    });

    await test.step('Create the data connector to delete', async () => {
      await sysAdminActor.attemptsTo(DataConnectorTasks.create(connectorName, 'Security Scorecard Data Connector'));
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
