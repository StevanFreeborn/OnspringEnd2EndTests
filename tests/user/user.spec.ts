import { FakeDataFactory, Role, UserFactory } from '@stevanfreeborn/onspring-models';
import {
  EditUserPageTargets,
  GroupTasks,
  RoleTasks,
  UsersPageTargets,
  UserTasks,
} from '@stevanfreeborn/onspring-ui';
import { test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('User', () => {
  let usersToDelete: string[] = [];

  test.beforeEach(async ({ sysAdminActor }) => {
    await sysAdminActor.browse().goto('/Admin/Home');
  });

  test.afterEach(async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(UserTasks.deleteUsers(usersToDelete));
    usersToDelete = [];
  });

  test('Create a User via the create button in the header of the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-668',
    });

    const newUser = UserFactory.createNewUser('Active');
    usersToDelete.push(newUser.username);

    await test.step('Create the user', async () => {
      await sysAdminActor.attemptsTo(UserTasks.createViaHeader(newUser));
    });

    await test.step('Verify user is created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(EditUserPageTargets.pathRegex);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.firstNameInput).hasValue(newUser.firstName);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.lastNameInput).hasValue(newUser.lastName);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.usernameInput).hasValue(newUser.username);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.emailInput).hasValue(newUser.email);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.statusButton(newUser.status)).hasAttribute('class', /active-status/);
    });
  });

  test('Create a User via the create button on the Security tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-669',
    });

    const newUser = UserFactory.createNewUser('Inactive');
    usersToDelete.push(newUser.username);

    await test.step('Create the user', async () => {
      await sysAdminActor.attemptsTo(UserTasks.createViaSecurityTile(newUser));
    });

    await test.step('Verify user is created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(EditUserPageTargets.pathRegex);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.firstNameInput).hasValue(newUser.firstName);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.lastNameInput).hasValue(newUser.lastName);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.usernameInput).hasValue(newUser.username);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.emailInput).hasValue(newUser.email);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.statusButton(newUser.status)).hasAttribute('class', /active-status/);
    });
  });

  test('Create a User via the Create User button on the user home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-670',
    });

    const newUser = UserFactory.createNewUser('Inactive');
    usersToDelete.push(newUser.username);

    await test.step('Create the user', async () => {
      await sysAdminActor.attemptsTo(UserTasks.createFromGrid(newUser));
    });

    await test.step('Verify user is created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(EditUserPageTargets.pathRegex);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.firstNameInput).hasValue(newUser.firstName);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.lastNameInput).hasValue(newUser.lastName);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.usernameInput).hasValue(newUser.username);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.emailInput).hasValue(newUser.email);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.statusButton(newUser.status)).hasAttribute('class', /active-status/);
    });
  });

  test('Create a copy of a user', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-785',
    });

    const newUser = UserFactory.createNewUser('Inactive');
    const copiedUserUsername = `${newUser.username} (Copy)`;
    usersToDelete.push(newUser.username);
    usersToDelete.push(copiedUserUsername);

    await test.step('Create the user to copy', async () => {
      await sysAdminActor.attemptsTo(UserTasks.create(newUser));
    });

    await test.step('Copy the user', async () => {
      await sysAdminActor.attemptsTo(UserTasks.copy(newUser.username, copiedUserUsername));
    });

    await test.step('Verify the user is copied', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(EditUserPageTargets.pathRegex);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.firstNameInput).hasValue(newUser.firstName);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.lastNameInput).hasValue(newUser.lastName);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.usernameInput).hasValue(copiedUserUsername);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.emailInput).hasValue(newUser.email);
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.statusButton(newUser.status)).hasAttribute('class', /active-status/);
    });
  });

  test('Update a user', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-674',
    });

    const newUser = UserFactory.createNewUser('Inactive');
    usersToDelete.push(newUser.username);

    await test.step('Create the user to update', async () => {
      await sysAdminActor.attemptsTo(UserTasks.create(newUser));
    });

    await test.step('Update the user', async () => {
      await sysAdminActor.attemptsTo(UserTasks.updateStatus('Locked'));
    });

    await test.step('Verify user is updated correctly', async () => {
      await sysAdminActor.browse().check(EditUserPageTargets.generalTab.statusButton('Locked')).hasAttribute('class', /active-status/);
    });
  });

  test('Assign a role to a user', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-676',
    });

    const roleName = FakeDataFactory.createFakeRoleName();
    const newUser = UserFactory.createNewUser('Inactive');
    usersToDelete.push(newUser.username);

    await test.step('Create the role to assign to the user', async () => {
      await sysAdminActor.attemptsTo(RoleTasks.create(new Role({ name: roleName })));
    });

    await test.step('Create the user to assign the role to', async () => {
      await sysAdminActor.attemptsTo(UserTasks.create(newUser));
    });

    await test.step('Assign the role to the user', async () => {
      await sysAdminActor.attemptsTo(UserTasks.assignRole(roleName));
    });

    await test.step('Verify the role is assigned to the user', async () => {
      const roleRow = EditUserPageTargets.securityTab.rolesReferenceGrid.rowByName(roleName);
      await sysAdminActor.browse().check(roleRow).isVisible();
    });

    await test.step('Delete the role', async () => {
      await sysAdminActor.attemptsTo(RoleTasks.deleteRoles([roleName]));
    });
  });

  test('Assign a group to a user', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-677',
    });

    const groupName = FakeDataFactory.createFakeGroupName();
    const newUser = UserFactory.createNewUser('Inactive');
    usersToDelete.push(newUser.username);

    await test.step('Create the group to assign to the user', async () => {
      await sysAdminActor.attemptsTo(GroupTasks.create(groupName));
    });

    await test.step('Create the user to assign the group to', async () => {
      await sysAdminActor.attemptsTo(UserTasks.create(newUser));
    });

    await test.step('Assign the group to the user', async () => {
      await sysAdminActor.attemptsTo(UserTasks.assignGroup(groupName));
    });

    await test.step('Verify the group is assigned to the user', async () => {
      const groupRow = EditUserPageTargets.securityTab.groupsReferenceGrid.rowByName(groupName);
      await sysAdminActor.browse().check(groupRow).isVisible();
    });

    await test.step('Delete the group', async () => {
      await sysAdminActor.attemptsTo(GroupTasks.deleteGroups([groupName]));
    });
  });

  test('Delete a user', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-675',
    });

    const newUser = UserFactory.createNewUser('Inactive');
    const userRow = UsersPageTargets.rowByName(newUser.username);

    await test.step('Create user to delete', async () => {
      await sysAdminActor.attemptsTo(UserTasks.create(newUser));
    });

    await test.step('Navigate to users security admin page', async () => {
      await sysAdminActor.attemptsTo(UserTasks.goto());
      await sysAdminActor.browse().check(userRow).isVisible();
    });

    await test.step('Delete user', async () => {
      await sysAdminActor.attemptsTo(UserTasks.deleteUsers([newUser.username]));
    });

    await test.step('Verify user is deleted', async () => {
      await sysAdminActor.browse().check(userRow).isNotAttached();
    });
  });
});

