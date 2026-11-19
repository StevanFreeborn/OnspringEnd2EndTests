import { FakeDataFactory, SharedList } from '@stevanfreeborn/onspring-models';
import { EditSharedListPageTargets, SharedListsPageTargets, SharedListTasks } from '@stevanfreeborn/onspring-ui';
import { test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('shared lists', () => {
  let listsToDelete: string[] = [];

  test.afterEach(async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(SharedListTasks.deleteLists(listsToDelete));
    listsToDelete = [];
  });

  test('Create a shared list via the create button in the header of the admin home page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-637',
    });

    const listName = FakeDataFactory.createFakeListName();
    listsToDelete.push(listName);

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the shared list', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.createViaHeader(listName));
    });

    await test.step('Verify the shared list was created', async () => {
      await sysAdminActor.browse().check(EditSharedListPageTargets.generalTab.nameInput).hasValue(listName);
    });
  });

  test('Create a shared list via the create button on the Lists tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-638',
    });

    const listName = FakeDataFactory.createFakeListName();
    listsToDelete.push(listName);

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create the shared list', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.createViaTile(listName));
    });

    await test.step('Verify the shared list was created', async () => {
      await sysAdminActor.browse().check(EditSharedListPageTargets.generalTab.nameInput).hasValue(listName);
    });
  });

  test('Create a shared list via the "Create List" button on the shared list home page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-639',
    });

    const listName = FakeDataFactory.createFakeListName();
    listsToDelete.push(listName);

    await test.step('Navigate to the shared list home page', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.goto());
    });

    await test.step('Create the shared list', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.create(listName));
    });

    await test.step('Verify the shared list was created', async () => {
      await sysAdminActor.browse().check(EditSharedListPageTargets.generalTab.nameInput).hasValue(listName);
    });
  });

  test('Create a copy of a shared list via the create button in the header of the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-640',
    });

    const listToCopyName = FakeDataFactory.createFakeListName();
    const listCopyName = FakeDataFactory.createFakeListName();
    listsToDelete.push(listToCopyName, listCopyName);

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create list to copy', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.createViaHeader(listToCopyName));
    });

    await test.step('Navigate back to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create a copy of the shared list', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.copyViaHeader(listToCopyName, listCopyName));
    });

    await test.step('Verify the shared list was created', async () => {
      await sysAdminActor.browse().check(EditSharedListPageTargets.generalTab.nameInput).hasValue(listCopyName);
    });
  });

  test('Create a copy of a shared list via the create button on the Lists tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-641',
    });

    const listToCopyName = FakeDataFactory.createFakeListName();
    const listCopyName = FakeDataFactory.createFakeListName();
    listsToDelete.push(listToCopyName, listCopyName);

    await test.step('Navigate to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create list to copy', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.createViaTile(listToCopyName));
    });

    await test.step('Navigate back to the admin home page', async () => {
      await sysAdminActor.browse().goto('/Admin/Home');
    });

    await test.step('Create a copy of the shared list', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.copyViaTile(listToCopyName, listCopyName));
    });

    await test.step('Verify the shared list was created', async () => {
      await sysAdminActor.browse().check(EditSharedListPageTargets.generalTab.nameInput).hasValue(listCopyName);
    });
  });

  test('Create a copy of a shared list via the "Create List" button on the shared list home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-642',
    });

    const listToCopyName = FakeDataFactory.createFakeListName();
    const listCopyName = FakeDataFactory.createFakeListName();
    listsToDelete.push(listToCopyName, listCopyName);

    await test.step('Navigate to the shared list home page', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.goto());
    });

    await test.step('Create list to copy', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.create(listToCopyName));
    });

    await test.step('Navigate back to the shared list home page', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.goto());
    });

    await test.step('Create a copy of the shared list', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.copyFromGrid(listToCopyName, listCopyName));
    });

    await test.step('Verify the shared list was created', async () => {
      await sysAdminActor.browse().check(EditSharedListPageTargets.generalTab.nameInput).hasValue(listCopyName);
    });
  });

  test('Update a shared list', async ({ sysAdminActor }) => {
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
      await sysAdminActor.attemptsTo(SharedListTasks.goto());
    });

    await test.step('Create a shared list', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.create(list.name));
    });

    await test.step('Update the shared list', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.update(list));
    });

    await test.step('Verify the shared list was updated', async () => {
      await sysAdminActor.browse().reload();
      await sysAdminActor.browse().check(EditSharedListPageTargets.generalTab.nameInput).hasValue(list.name);
      await sysAdminActor
        .browse()
        .check(EditSharedListPageTargets.generalTab.descriptionEditor)
        .hasText(expectedDescription);
      await sysAdminActor
        .browse()
        .check(EditSharedListPageTargets.generalTab.statusSwitch)
        .hasAttribute('aria-checked', expectedStatus.toString());
    });
  });

  test('Delete a shared list', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-644',
    });

    const listToDeleteName = FakeDataFactory.createFakeListName();
    const listRow = SharedListsPageTargets.rowByName(listToDeleteName);

    await test.step('Navigate to the shared list home page', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.goto());
    });

    await test.step('Create the list to delete', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.create(listToDeleteName));
    });

    await test.step('Navigate back to the shared list home page', async () => {
      await sysAdminActor.attemptsTo(SharedListTasks.goto());
    });

    await test.step('Delete the list', async () => {
      await sysAdminActor.browse().hover(listRow);
      await sysAdminActor.browse().click(SharedListsPageTargets.deleteButtonInRow(listToDeleteName));

      await sysAdminActor.attemptsTo(SharedListTasks.deleteLists([listToDeleteName]));
    });

    await test.step('Verify the list was deleted', async () => {
      await sysAdminActor.browse().check(listRow).isNotAttached();
    });
  });
});
