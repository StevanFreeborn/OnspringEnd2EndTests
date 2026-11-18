import { FakeDataFactory } from '@stevanfreeborn/onspring-models';
import {
  EditGroupPageTargets,
  GroupsPageTargets,
  GroupTasks,
  SecurityPillNavTargets,
  UserTasks,
} from '@stevanfreeborn/onspring-ui';
import { test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('Group', () => {
  let groupsToDelete: string[] = [];

  test.beforeEach(async ({ sysAdminActor }) => {
    await sysAdminActor.browse().goto('/Admin/Home');
  });

  test.afterEach(async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(GroupTasks.deleteGroups(groupsToDelete));
    groupsToDelete = [];
  });

  test('Create a Group via the create button in the header of the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-494',
    });

    const groupName = FakeDataFactory.createFakeGroupName();
    groupsToDelete.push(groupName);

    await test.step('Create a new group', async () => {
      await sysAdminActor.attemptsTo(GroupTasks.createViaHeader(groupName));
    });

    await test.step('Verify the group is created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(EditGroupPageTargets.pathRegex);
      await sysAdminActor.browse().check(EditGroupPageTargets.nameInput).hasValue(groupName);
    });
  });

  test('Create a Group via the create button on the Security tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-495',
    });

    const groupName = FakeDataFactory.createFakeGroupName();
    groupsToDelete.push(groupName);

    await test.step('Create the group', async () => {
      await sysAdminActor.attemptsTo(GroupTasks.createViaSecurityTile(groupName));
    });

    await test.step('Verify the group is created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(EditGroupPageTargets.pathRegex);
      await sysAdminActor.browse().check(EditGroupPageTargets.nameInput).hasValue(groupName);
    });
  });

  test('Create a Group via the Create Group button on the group home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-496',
    });

    const groupName = FakeDataFactory.createFakeGroupName();
    groupsToDelete.push(groupName);

    await test.step('Navigate to the groups security admin page', async () => {
      await sysAdminActor.attemptsTo(UserTasks.goto());
      await sysAdminActor.browse().click(SecurityPillNavTargets.groupsPill);
    });

    await test.step('Create the group', async () => {
      await sysAdminActor.attemptsTo(GroupTasks.createFromGrid(groupName));
    });

    await test.step('Verify the group is created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(EditGroupPageTargets.pathRegex);
      await sysAdminActor.browse().check(EditGroupPageTargets.nameInput).hasValue(groupName);
    });
  });

  test('Update a group', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-500',
    });

    const groupName = FakeDataFactory.createFakeGroupName();
    groupsToDelete.push(groupName);
    const description = 'This is a test description';

    await test.step('Create the group to update', async () => {
      await sysAdminActor.attemptsTo(GroupTasks.create(groupName));
    });

    await test.step('Update the group', async () => {
      await sysAdminActor.attemptsTo(GroupTasks.updateDescription(description));
    });

    await test.step('Verify the group is updated', async () => {
      await sysAdminActor.browse().check(EditGroupPageTargets.descriptionEditor).hasText(description);
    });
  });

  test('Create a copy of a group', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-784',
    });

    const groupName = FakeDataFactory.createFakeGroupName();
    const copiedGroupName = `${groupName} (Copy)`;
    groupsToDelete.push(groupName);
    groupsToDelete.push(copiedGroupName);

    await test.step('Create the group to copy', async () => {
      await sysAdminActor.attemptsTo(GroupTasks.create(groupName));
    });

    await test.step('Copy the role', async () => {
      await sysAdminActor.attemptsTo(GroupTasks.copy(groupName, copiedGroupName));
    });

    await test.step('Verify the group is copied', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(EditGroupPageTargets.pathRegex);
      await sysAdminActor.browse().check(EditGroupPageTargets.nameInput).hasValue(copiedGroupName);
    });
  });

  test('Delete a Group', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-501',
    });

    const groupName = FakeDataFactory.createFakeGroupName();
    const groupRow = GroupsPageTargets.rowByName(groupName);

    await test.step('Create group to delete', async () => {
      await sysAdminActor.attemptsTo(GroupTasks.create(groupName));
    });

    await test.step('Navigate to the groups security admin page', async () => {
      await sysAdminActor.attemptsTo(GroupTasks.goto());
      await sysAdminActor.browse().check(groupRow).isVisible();
    });

    await test.step('Delete the group', async () => {
      await sysAdminActor.attemptsTo(GroupTasks.deleteGroups([groupName]));
    });

    await test.step('Verify the group is deleted', async () => {
      await sysAdminActor.browse().check(groupRow).isNotAttached();
    });
  });
});
