import { FakeDataFactory } from '@stevanfreeborn/onspring-models';
import {
  ContainersPageTargets,
  ContainerTasks,
  CopyContainerPageTargets,
  EditContainerPageTargets,
} from '@stevanfreeborn/onspring-ui';
import { test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('container', () => {
  let containersToBeDeleted: string[] = [];

  test.beforeEach(async ({ sysAdminActor }) => {
    await sysAdminActor.browse().goto('/Admin/Home');
  });

  test.afterEach(async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(ContainerTasks.deleteContainers(containersToBeDeleted));
    containersToBeDeleted = [];
  });

  test('Create a container via the create button in the header of the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-292',
    });

    const containerName = FakeDataFactory.createFakeContainerName();
    containersToBeDeleted.push(containerName);

    await test.step('Create the container', async () => {
      await sysAdminActor.attemptsTo(ContainerTasks.createViaHeader(containerName));
    });

    await test.step('Verify the container was created', async () => {
      await sysAdminActor.attemptsTo(ContainerTasks.goto());
      await sysAdminActor.browse().check(ContainersPageTargets.rowByName(containerName)).isVisible();
    });
  });

  test('Create a container via the create button on the Dashboards tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-293',
    });

    const containerName = FakeDataFactory.createFakeContainerName();
    containersToBeDeleted.push(containerName);

    await test.step('Create the container', async () => {
      await sysAdminActor.attemptsTo(ContainerTasks.createViaTile(containerName));
    });

    await test.step('Verify the container was created', async () => {
      await sysAdminActor.attemptsTo(ContainerTasks.goto());
      await sysAdminActor.browse().check(ContainersPageTargets.rowByName(containerName)).isVisible();
    });
  });

  test('Create a container via the "Create Container" button on the Containers home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-294',
    });

    const containerName = FakeDataFactory.createFakeContainerName();
    containersToBeDeleted.push(containerName);

    await test.step('Create the container', async () => {
      await sysAdminActor.attemptsTo(ContainerTasks.create(containerName));
    });

    await test.step('Verify the container was created', async () => {
      await sysAdminActor.attemptsTo(ContainerTasks.goto());
      await sysAdminActor.browse().check(ContainersPageTargets.rowByName(containerName)).isVisible();
    });
  });

  test('Create a copy of a container', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-783',
    });

    const containerName = FakeDataFactory.createFakeContainerName();
    const containerCopyName = `${containerName} Copy`;
    containersToBeDeleted.push(containerName, containerCopyName);

    await test.step('Create the container to copy', async () => {
      await sysAdminActor.attemptsTo(ContainerTasks.createViaHeader(containerName));
    });

    await test.step('Create a copy of the container', async () => {
      await sysAdminActor.attemptsTo(ContainerTasks.goto());
      const row = ContainersPageTargets.rowByName(containerName);
      await sysAdminActor.browse().hover(row);
      await sysAdminActor.browse().click(ContainersPageTargets.copyButtonInRow(containerName));
      await sysAdminActor.browse().waitForUrl(CopyContainerPageTargets.pathRegex);

      await sysAdminActor.browse().check(CopyContainerPageTargets.nameInput).hasValue(containerName);

      await sysAdminActor.browse().type(CopyContainerPageTargets.nameInput, containerCopyName);
      await sysAdminActor.browse().click(CopyContainerPageTargets.saveChangesButton);
      await sysAdminActor.browse().waitForUrl(EditContainerPageTargets.pathRegex);
    });

    await test.step('Verify the container was copied', async () => {
      await sysAdminActor.attemptsTo(ContainerTasks.goto());
      await sysAdminActor.browse().check(ContainersPageTargets.rowByName(containerCopyName)).isVisible();
    });
  });

  test('Update a container', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-298',
    });

    const containerName = FakeDataFactory.createFakeContainerName();
    const updatedContainerName = `${containerName} Updated`;
    containersToBeDeleted.push(updatedContainerName);

    await test.step('Create the container to update', async () => {
      await sysAdminActor.attemptsTo(ContainerTasks.createViaHeader(containerName));
    });

    await test.step('Verify the container was created', async () => {
      await sysAdminActor.attemptsTo(ContainerTasks.goto());
      await sysAdminActor.browse().check(ContainersPageTargets.rowByName(containerName)).isVisible();
    });

    await test.step('Update the container', async () => {
      const row = ContainersPageTargets.rowByName(containerName);
      await sysAdminActor.browse().click(row);
      await sysAdminActor.browse().waitForUrl(EditContainerPageTargets.pathRegex);

      await sysAdminActor.attemptsTo(ContainerTasks.updateName(updatedContainerName));
    });

    await test.step('Verify the container was updated', async () => {
      await sysAdminActor.attemptsTo(ContainerTasks.goto());
      await sysAdminActor.browse().check(ContainersPageTargets.rowByName(updatedContainerName)).isVisible();
    });
  });

  test('Delete a container', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-299',
    });

    const containerName = FakeDataFactory.createFakeContainerName();

    await test.step('Create the container to delete', async () => {
      await sysAdminActor.attemptsTo(ContainerTasks.create(containerName));
    });

    await test.step('Delete the container', async () => {
      await sysAdminActor.attemptsTo(ContainerTasks.deleteContainers([containerName]));
    });

    await test.step('Verify the container was deleted', async () => {
      await sysAdminActor.browse().check(ContainersPageTargets.rowByName(containerName)).isHidden();
    });
  });
});
