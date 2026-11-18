import {
  AdminTileTargets,
  EditRolePageTargets,
  RolesSecurityPageTargets,
  RoleTasks,
  SecurityPillNavTargets,
} from '@stevanfreeborn/onspring-ui';
import { FakeDataFactory, Role } from '@stevanfreeborn/onspring-models';
import { test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('Role', () => {
  let rolesToDelete: string[] = [];

  test.beforeEach(async ({ sysAdminActor }) => {
    await sysAdminActor.browse().goto('/Admin/Home');
  });

  test.afterEach(async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(RoleTasks.deleteRoles(rolesToDelete));
    rolesToDelete = [];
  });

  test('Create a Role via the create button in the header of the admin home page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-625',
    });

    const roleName = FakeDataFactory.createFakeRoleName();
    rolesToDelete.push(roleName);

    await test.step('Create the role', async () => {
      await sysAdminActor.attemptsTo(RoleTasks.createViaHeader(roleName));
    });

    await test.step('Verify the role is created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(EditRolePageTargets.pathRegex);
      await sysAdminActor.browse().check(EditRolePageTargets.generalTab.nameInput).hasValue(roleName);
      await sysAdminActor.browse().check(EditRolePageTargets.generalTab.statusSwitch).hasAttribute('aria-checked', 'false');
    });
  });

  test('Create a Role via the create button on the Security tile on the admin home page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-626',
    });

    const roleName = FakeDataFactory.createFakeRoleName();
    rolesToDelete.push(roleName);

    await test.step('Create the role', async () => {
      await sysAdminActor.attemptsTo(RoleTasks.createViaSecurityTile(roleName));
    });

    await test.step('Verify the role is created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(EditRolePageTargets.pathRegex);
      await sysAdminActor.browse().check(EditRolePageTargets.generalTab.nameInput).hasValue(roleName);
      await sysAdminActor.browse().check(EditRolePageTargets.generalTab.statusSwitch).hasAttribute('aria-checked', 'false');
    });
  });

  test('Create a Role via the Create Role button on the role home page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-627',
    });

    const roleName = FakeDataFactory.createFakeRoleName();
    rolesToDelete.push(roleName);

    await test.step('Navigate to the roles security admin page', async () => {
      await sysAdminActor.browse().click(AdminTileTargets.securityTileLink);
      await sysAdminActor.browse().click(SecurityPillNavTargets.rolesPill);
    });

    await test.step('Create the role', async () => {
      await sysAdminActor.attemptsTo(RoleTasks.createFromGrid(roleName));
    });

    await test.step('Verify the role is created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(EditRolePageTargets.pathRegex);
      await sysAdminActor.browse().check(EditRolePageTargets.generalTab.nameInput).hasValue(roleName);
      await sysAdminActor.browse().check(EditRolePageTargets.generalTab.statusSwitch).hasAttribute('aria-checked', 'false');
    });
  });

  test('Update a role', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-631',
    });

    const roleName = FakeDataFactory.createFakeRoleName();
    rolesToDelete.push(roleName);
    const description = 'This is a test description';

    await test.step('Create the role to update', async () => {
      await sysAdminActor.attemptsTo(RoleTasks.create(new Role({ name: roleName })));
      await sysAdminActor.browse().checkPage().hasUrl(EditRolePageTargets.pathRegex);
    });

    await test.step('Update the role', async () => {
      await sysAdminActor.browse().type(EditRolePageTargets.generalTab.descriptionEditor, description);
      await sysAdminActor.attemptsTo(RoleTasks.save());
    });

    await test.step('Verify the role is updated', async () => {
      await sysAdminActor.browse().check(EditRolePageTargets.generalTab.descriptionEditor).hasText(description);
    });
  });

  test('Create a copy of a role', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-786',
    });

    const roleName = FakeDataFactory.createFakeRoleName();
    const copiedRoleName = `${roleName} (Copy)`;
    rolesToDelete.push(roleName);
    rolesToDelete.push(copiedRoleName);

    await test.step('Create the role to copy', async () => {
      await sysAdminActor.attemptsTo(RoleTasks.create(new Role({ name: roleName })));
      await sysAdminActor.browse().checkPage().hasUrl(EditRolePageTargets.pathRegex);
    });

    await test.step('Copy the role', async () => {
      await sysAdminActor.attemptsTo(RoleTasks.copy(roleName, copiedRoleName));
    });

    await test.step('Verify the role is copied', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(EditRolePageTargets.pathRegex);
      await sysAdminActor.browse().check(EditRolePageTargets.generalTab.nameInput).hasValue(copiedRoleName);
    });
  });

  test('Delete a Role', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-632',
    });

    const roleName = FakeDataFactory.createFakeRoleName();
    const roleRow = RolesSecurityPageTargets.rowByName(roleName);

    await test.step('Create role to delete', async () => {
      await sysAdminActor.attemptsTo(RoleTasks.create(new Role({ name: roleName })));
      await sysAdminActor.browse().checkPage().hasUrl(EditRolePageTargets.pathRegex);
    });

    await test.step('Navigate to the roles security admin page', async () => {
      await sysAdminActor.attemptsTo(RoleTasks.goto());
      await sysAdminActor.browse().check(roleRow).isAttached();
    });

    await test.step('Delete the role', async () => {
      await sysAdminActor.attemptsTo(RoleTasks.deleteRoles([roleName]));
    });

    await test.step('Verify the role is deleted', async () => {
      await sysAdminActor.browse().check(roleRow).isNotAttached();
    });
  });
});
