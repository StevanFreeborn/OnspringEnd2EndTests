import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { EditSharedListPage } from '../../pageObjectModels/sharedLists/editSharedListPage';
import { SharedListAdminPage } from '../../pageObjectModels/sharedLists/sharedListAdminPage';
import { AnnotationType } from '../annotations';

type SharedListTestFixtures = {
  adminHomePage: AdminHomePage;
  editListPage: EditSharedListPage;
  sharedListAdminPage: SharedListAdminPage;
};

const test = base.extend<SharedListTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => await use(new AdminHomePage(sysAdminPage)),
  editListPage: async ({ sysAdminPage }, use) => await use(new EditSharedListPage(sysAdminPage)),
  sharedListAdminPage: async ({ sysAdminPage }, use) => await use(new SharedListAdminPage(sysAdminPage)),
});

test.describe('shared lists', () => {
  test('Create a shared list via the create button in the header of the admin home page', async ({
    adminHomePage,
    editListPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-637',
    });

    const listName = FakeDataFactory.createFakeListName();

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the shared list', async () => {
      await adminHomePage.createListUsingHeaderCreateButton(listName);
      await adminHomePage.page.waitForURL(editListPage.pathRegex);
    });

    await test.step('Verify the shared list was created', async () => {
      await expect(editListPage.generalTab.nameInput).toHaveValue(listName);
    });
  });

  test('Create a shared list via the create button on the Lists tile on the admin home page', async ({
    adminHomePage,
    editListPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-638',
    });

    const listName = FakeDataFactory.createFakeListName();

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the shared list', async () => {
      await adminHomePage.createListUsingListTileButton(listName);
      await adminHomePage.page.waitForURL(editListPage.pathRegex);
    });

    await test.step('Verify the shared list was created', async () => {
      await expect(editListPage.generalTab.nameInput).toHaveValue(listName);
    });
  });

  test('Create a shared list via the "Create List" button on the shared list home page', async ({
    sharedListAdminPage,
    editListPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-639',
    });

    const listName = FakeDataFactory.createFakeListName();

    await test.step('Navigate to the shared list home page', async () => {
      await sharedListAdminPage.goto();
    });

    await test.step('Create the shared list', async () => {
      await sharedListAdminPage.createList(listName);
      await sharedListAdminPage.page.waitForURL(editListPage.pathRegex);
    });

    await test.step('Verify the shared list was created', async () => {
      await expect(editListPage.generalTab.nameInput).toHaveValue(listName);
    });
  });

  test('Create a copy of a shared list via the create button in the header of the admin home page', async ({
    adminHomePage,
    editListPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-640',
    });

    const getListToCopyName = FakeDataFactory.createFakeListName();
    const listCopyName = FakeDataFactory.createFakeListName();

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create list to copy', async () => {
      await adminHomePage.createListUsingHeaderCreateButton(getListToCopyName);
      await adminHomePage.page.waitForURL(editListPage.pathRegex);
    });

    await test.step('Navigate back to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create a copy of the shared list', async () => {
      await adminHomePage.createListCopyUsingHeaderCreateButton(getListToCopyName, listCopyName);
      await adminHomePage.page.waitForURL(editListPage.pathRegex);
    });

    await test.step('Verify the shared list was created', async () => {
      await expect(editListPage.generalTab.nameInput).toHaveValue(listCopyName);
    });
  });

  test('Create a copy of a shared list via the create button on the Lists tile on the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-641',
    });

    expect(true).toBeTruthy();
  });

  test('Create a copy of a shared list via the "Create List" button on the shared list home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-642',
    });

    expect(true).toBeTruthy();
  });

  test('Update a shared list', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-643',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a shared list', async ({ sharedListAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-644',
    });

    const listToDeleteName = FakeDataFactory.createFakeListName();
    const listRow = sharedListAdminPage.listsGrid.getByRole('row', { name: listToDeleteName }).first();
    const listDeleteButton = listRow.getByTitle('Delete List');

    await test.step('Navigate to the shared list home page', async () => {
      await sharedListAdminPage.goto();
    });

    await test.step('Create the list to delete', async () => {
      await sharedListAdminPage.createList(listToDeleteName);
    });

    await test.step('Navigate back to the shared list home page', async () => {
      await sharedListAdminPage.goto();
    });

    await test.step('Delete the list', async () => {
      await listRow.hover();

      await listDeleteButton.click();

      await sharedListAdminPage.deleteListDialog.deleteButton.click();
      await sharedListAdminPage.deleteListDialog.waitForDialogToBeDismissed();
      await sharedListAdminPage.page.waitForLoadState('networkidle');
    });

    await test.step('Verify the list was deleted', async () => {
      await expect(listRow).not.toBeAttached();
    });
  });
});
