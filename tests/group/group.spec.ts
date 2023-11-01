import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AddGroupAdminPage } from '../../pageObjectModels/groups/addGroupAdminPage';
import { EditGroupAdminPage } from '../../pageObjectModels/groups/editGroupAdminPage';
import { GroupsSecurityAdminPage } from '../../pageObjectModels/groups/groupsSecurityAdminPage';
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

    await test.step('Delete the role', async () => {
      await groupRow.hover();
      await groupRow.getByTitle('Delete Group').click();
      await groupsSecurityAdminPage.deleteGroupDialog.deleteButton.click();
      await groupsSecurityAdminPage.deleteGroupDialog.waitForDialogToBeDismissed();
      await groupsSecurityAdminPage.page.waitForLoadState('networkidle');
    });

    await test.step('Verify the group is deleted', async () => {
      await expect(groupRow).not.toBeAttached();
    });
  });
});
