import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AddGroupAdminPage } from '../../pageObjectModels/groups/addGroupAdminPage';
import { CopyGroupAdminPage } from '../../pageObjectModels/groups/copyGroupAdminPage';
import { EditGroupAdminPage } from '../../pageObjectModels/groups/editGroupAdminPage';
import { GroupsSecurityAdminPage } from '../../pageObjectModels/groups/groupsSecurityAdminPage';
import { UsersSecurityAdminPage } from '../../pageObjectModels/users/usersSecurityAdminPage';
import { AnnotationType } from '../annotations';

type GroupTestFixtures = {
  adminHomePage: AdminHomePage;
  addGroupAdminPage: AddGroupAdminPage;
  editGroupAdminPage: EditGroupAdminPage;
  groupsSecurityAdminPage: GroupsSecurityAdminPage;
};

const test = base.extend<GroupTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    await use(adminHomePage);
  },
  addGroupAdminPage: async ({ sysAdminPage }, use) => {
    const addGroupAdminPage = new AddGroupAdminPage(sysAdminPage);
    await use(addGroupAdminPage);
  },
  editGroupAdminPage: async ({ sysAdminPage }, use) => {
    const editGroupAdminPage = new EditGroupAdminPage(sysAdminPage);
    await use(editGroupAdminPage);
  },
  groupsSecurityAdminPage: async ({ sysAdminPage }, use) => {
    const groupsSecurityAdminPage = new GroupsSecurityAdminPage(sysAdminPage);
    await use(groupsSecurityAdminPage);
  },
});

test.describe('Group', () => {
  let groupsToDelete: string[] = [];

  test.beforeEach(async ({ adminHomePage }) => {
    await adminHomePage.goto();
  });

  test.afterEach(async ({ groupsSecurityAdminPage }) => {
    await groupsSecurityAdminPage.deleteGroups(groupsToDelete);
    groupsToDelete = [];
  });

  test('Create a Group via the create button in the header of the admin home page', async ({
    adminHomePage,
    addGroupAdminPage,
    editGroupAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-494',
    });

    const groupName = FakeDataFactory.createFakeGroupName();
    groupsToDelete.push(groupName);

    await test.step('Create a new group', async () => {
      await adminHomePage.adminNav.adminCreateButton.hover();
      await adminHomePage.adminNav.adminCreateMenu.waitFor();
      await adminHomePage.adminNav.groupCreateMenuOption.click();
      await addGroupAdminPage.page.waitForLoadState();
      await addGroupAdminPage.nameInput.fill(groupName);
      await addGroupAdminPage.saveRecordButton.click();
    });

    await test.step('Verify the group is created correctly', async () => {
      await editGroupAdminPage.page.waitForLoadState();
      await editGroupAdminPage.page.waitForURL(editGroupAdminPage.pathRegex);

      expect(editGroupAdminPage.page.url()).toMatch(editGroupAdminPage.pathRegex);
      await expect(editGroupAdminPage.nameInput).toHaveValue(groupName);
    });
  });

  test('Create a Group via the create button on the Security tile on the admin home page', async ({
    adminHomePage,
    addGroupAdminPage,
    editGroupAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-495',
    });

    const groupName = FakeDataFactory.createFakeGroupName();
    groupsToDelete.push(groupName);

    await test.step('Create the group', async () => {
      await adminHomePage.securityTileLink.hover();
      await adminHomePage.securityTileCreateButton.waitFor();
      await adminHomePage.securityTileCreateButton.click();

      await expect(adminHomePage.securityCreateMenu).toBeVisible();

      await adminHomePage.securityCreateMenu.getByText('Group').click();
      await addGroupAdminPage.page.waitForLoadState();
      await addGroupAdminPage.nameInput.fill(groupName);
      await addGroupAdminPage.saveRecordButton.click();
    });

    await test.step('Verify the group is created correctly', async () => {
      await editGroupAdminPage.page.waitForURL(editGroupAdminPage.pathRegex);
      await editGroupAdminPage.page.waitForLoadState();

      expect(editGroupAdminPage.page.url()).toMatch(editGroupAdminPage.pathRegex);
      await expect(editGroupAdminPage.nameInput).toHaveValue(groupName);
    });
  });

  test('Create a Group via the Create Group button on the group home page', async ({
    sysAdminPage,
    adminHomePage,
    groupsSecurityAdminPage,
    addGroupAdminPage,
    editGroupAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-496',
    });

    const usersSecurityAdminPage = new UsersSecurityAdminPage(sysAdminPage);
    const groupName = FakeDataFactory.createFakeGroupName();
    groupsToDelete.push(groupName);

    await test.step('Navigate to the groups security admin page', async () => {
      await adminHomePage.securityTileLink.click();
      await usersSecurityAdminPage.pillNav.groupsPillButton.click();
    });

    await test.step('Create the group', async () => {
      await groupsSecurityAdminPage.createGroupButton.click();
      await addGroupAdminPage.page.waitForLoadState();
      await addGroupAdminPage.nameInput.fill(groupName);
      await addGroupAdminPage.saveRecordButton.click();
    });

    await test.step('Verify the group is created correctly', async () => {
      await editGroupAdminPage.page.waitForURL(editGroupAdminPage.pathRegex);
      await editGroupAdminPage.page.waitForLoadState();

      expect(editGroupAdminPage.page.url()).toMatch(editGroupAdminPage.pathRegex);
      await expect(editGroupAdminPage.nameInput).toHaveValue(groupName);
    });
  });

  test('Update a group', async ({ addGroupAdminPage, editGroupAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-500',
    });

    const groupName = FakeDataFactory.createFakeGroupName();
    groupsToDelete.push(groupName);
    const description = 'This is a test description';

    await test.step('Create the group to update', async () => {
      await addGroupAdminPage.addGroup(groupName);
      await addGroupAdminPage.page.waitForURL(editGroupAdminPage.pathRegex);
      await editGroupAdminPage.page.waitForLoadState();
    });

    await test.step('Update the group', async () => {
      await editGroupAdminPage.descriptionEditor.fill(description);
      await editGroupAdminPage.saveGroup();
    });

    await test.step('Verify the group is updated', async () => {
      await expect(editGroupAdminPage.descriptionEditor).toHaveText(description);
    });
  });

  test('Create a copy of a group', async ({
    sysAdminPage,
    addGroupAdminPage,
    editGroupAdminPage,
    groupsSecurityAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-784',
    });

    const copyGroupAdminPage = new CopyGroupAdminPage(sysAdminPage);
    const groupName = FakeDataFactory.createFakeGroupName();
    const copiedGroupName = `${groupName} (Copy)`;
    groupsToDelete.push(groupName);
    groupsToDelete.push(copiedGroupName);

    await test.step('Create the group to copy', async () => {
      await addGroupAdminPage.addGroup(groupName);
      await addGroupAdminPage.page.waitForURL(editGroupAdminPage.pathRegex);
      await editGroupAdminPage.page.waitForLoadState();
    });

    await test.step('Copy the role', async () => {
      const roleRow = groupsSecurityAdminPage.groupsGrid.getByRole('row', { name: groupName }).first();

      await groupsSecurityAdminPage.goto();
      await roleRow.hover();
      await roleRow.getByTitle('Copy Group').click();
      await copyGroupAdminPage.page.waitForLoadState();

      await expect(copyGroupAdminPage.nameInput).toHaveValue(groupName);

      await copyGroupAdminPage.nameInput.clear();
      await copyGroupAdminPage.nameInput.fill(copiedGroupName);
      await copyGroupAdminPage.saveRecordButton.click();
    });

    await test.step('Verify the group is copied', async () => {
      await copyGroupAdminPage.page.waitForURL(editGroupAdminPage.pathRegex);
      await editGroupAdminPage.page.waitForLoadState();

      expect(editGroupAdminPage.page.url()).toMatch(editGroupAdminPage.pathRegex);
      await expect(editGroupAdminPage.nameInput).toHaveValue(copiedGroupName);
    });
  });

  test('Delete a Group', async ({ addGroupAdminPage, editGroupAdminPage, groupsSecurityAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-501',
    });

    const groupName = FakeDataFactory.createFakeGroupName();
    const groupRow = groupsSecurityAdminPage.groupsGrid.getByRole('row', { name: groupName }).first();

    await test.step('Create group to delete', async () => {
      await addGroupAdminPage.addGroup(groupName);
      await addGroupAdminPage.page.waitForURL(editGroupAdminPage.pathRegex);
      await editGroupAdminPage.page.waitForLoadState();
    });

    await test.step('Navigate to the groups security admin page', async () => {
      await groupsSecurityAdminPage.goto();
      await expect(groupRow).toBeAttached();
    });

    await test.step('Delete the group', async () => {
      await groupRow.hover();
      await groupRow.getByTitle('Delete Group').click();

      const deleteGroupsResponse = groupsSecurityAdminPage.page.waitForResponse(
        groupsSecurityAdminPage.deleteGroupPathRegex
      );
      await groupsSecurityAdminPage.deleteGroupDialog.deleteButton.click();
      await deleteGroupsResponse;
      await groupsSecurityAdminPage.deleteGroupDialog.waitForDialogToBeDismissed();
    });

    await test.step('Verify the group is deleted', async () => {
      await expect(groupRow).not.toBeAttached();
    });
  });
});
