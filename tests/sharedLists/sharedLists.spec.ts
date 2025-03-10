import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { SharedList } from '../../models/sharedList';
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
  let listsToDelete: string[] = [];

  test.afterEach(async ({ sharedListAdminPage }) => {
    await sharedListAdminPage.deleteLists(listsToDelete);
    listsToDelete = [];
  });

  test('Create a shared list via the create button in the header of the admin home page', async ({
    adminHomePage,
    editListPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-637',
    });

    const listName = FakeDataFactory.createFakeListName();
    listsToDelete.push(listName);

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
    listsToDelete.push(listName);

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
    listsToDelete.push(listName);

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

    const listToCopyName = FakeDataFactory.createFakeListName();
    const listCopyName = FakeDataFactory.createFakeListName();
    listsToDelete.push(listToCopyName, listCopyName);

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create list to copy', async () => {
      await adminHomePage.createListUsingHeaderCreateButton(listToCopyName);
      await adminHomePage.page.waitForURL(editListPage.pathRegex);
    });

    await test.step('Navigate back to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create a copy of the shared list', async () => {
      await adminHomePage.createListCopyUsingHeaderCreateButton(listToCopyName, listCopyName);
      await adminHomePage.page.waitForURL(editListPage.pathRegex);
    });

    await test.step('Verify the shared list was created', async () => {
      await expect(editListPage.generalTab.nameInput).toHaveValue(listCopyName);
    });
  });

  test('Create a copy of a shared list via the create button on the Lists tile on the admin home page', async ({
    adminHomePage,
    editListPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-641',
    });

    const listToCopyName = FakeDataFactory.createFakeListName();
    const listCopyName = FakeDataFactory.createFakeListName();
    listsToDelete.push(listToCopyName, listCopyName);

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create list to copy', async () => {
      await adminHomePage.createListUsingListTileButton(listToCopyName);
      await adminHomePage.page.waitForURL(editListPage.pathRegex);
    });

    await test.step('Navigate back to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create a copy of the shared list', async () => {
      await adminHomePage.createListCopyUsingListTileButton(listToCopyName, listCopyName);
      await adminHomePage.page.waitForURL(editListPage.pathRegex);
    });

    await test.step('Verify the shared list was created', async () => {
      await expect(editListPage.generalTab.nameInput).toHaveValue(listCopyName);
    });
  });

  test('Create a copy of a shared list via the "Create List" button on the shared list home page', async ({
    sharedListAdminPage,
    editListPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-642',
    });

    const listToCopyName = FakeDataFactory.createFakeListName();
    const listCopyName = FakeDataFactory.createFakeListName();
    listsToDelete.push(listToCopyName, listCopyName);

    await test.step('Navigate to the shared list home page', async () => {
      await sharedListAdminPage.goto();
    });

    await test.step('Create list to copy', async () => {
      await sharedListAdminPage.createList(listToCopyName);
      await sharedListAdminPage.page.waitForURL(editListPage.pathRegex);
    });

    await test.step('Navigate back to the shared list home page', async () => {
      await sharedListAdminPage.goto();
    });

    await test.step('Create a copy of the shared list', async () => {
      await sharedListAdminPage.createListCopy(listToCopyName, listCopyName);
      await sharedListAdminPage.page.waitForURL(editListPage.pathRegex);
    });

    await test.step('Verify the shared list was created', async () => {
      await expect(editListPage.generalTab.nameInput).toHaveValue(listCopyName);
    });
  });

  test('Update a shared list', async ({ sharedListAdminPage, editListPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-643',
    });

    const expectedStatus = false;
    const expectedDescription = 'Test description';

    const list = new SharedList({
      name: FakeDataFactory.createFakeListName(),
      description: expectedDescription,
      status: expectedStatus,
    });

    listsToDelete.push(list.name);

    await test.step('Navigate to the shared list home page', async () => {
      await sharedListAdminPage.goto();
    });

    await test.step('Create a shared list', async () => {
      await sharedListAdminPage.createList(list.name);
      await sharedListAdminPage.page.waitForURL(editListPage.pathRegex);
    });

    await test.step('Update the shared list', async () => {
      await editListPage.updateList(list);
      await editListPage.save();
    });

    await test.step('Verify the shared list was updated', async () => {
      await editListPage.page.reload();
      await expect(editListPage.generalTab.nameInput).toHaveValue(list.name);
      await expect(editListPage.generalTab.descriptionEditor).toHaveText(expectedDescription);
      await expect(editListPage.generalTab.statusSwitch).toHaveAttribute('aria-checked', expectedStatus.toString());
    });
  });

  test('Delete a shared list', async ({ sharedListAdminPage, editListPage }) => {
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
      await sharedListAdminPage.page.waitForURL(editListPage.pathRegex);
    });

    await test.step('Navigate back to the shared list home page', async () => {
      await sharedListAdminPage.goto();
    });

    await test.step('Delete the list', async () => {
      await listRow.hover();

      await listDeleteButton.click();

      const deleteSharedListResponse = sharedListAdminPage.page.waitForResponse(
        sharedListAdminPage.deleteListPathRegex
      );
      await sharedListAdminPage.deleteListDialog.deleteButton.click();
      await deleteSharedListResponse;
      await sharedListAdminPage.deleteListDialog.waitForDialogToBeDismissed();
    });

    await test.step('Verify the list was deleted', async () => {
      await expect(listRow).not.toBeAttached();
    });
  });
});
