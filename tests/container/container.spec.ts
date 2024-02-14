import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AddContainerPage } from '../../pageObjectModels/containers/addContainerPage';
import { ContainersAdminPage } from '../../pageObjectModels/containers/containersAdminPage';
import { EditContainerPage } from '../../pageObjectModels/containers/editContainerPage';
import { AnnotationType } from '../annotations';

type ContainerTestFixtures = {
  adminHomePage: AdminHomePage;
  containersAdminPage: ContainersAdminPage;
  addContainerPage: AddContainerPage;
  editContainerPage: EditContainerPage;
};

const test = base.extend<ContainerTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    await use(adminHomePage);
  },
  containersAdminPage: async ({ sysAdminPage }, use) => {
    const containersAdminPage = new ContainersAdminPage(sysAdminPage);
    await use(containersAdminPage);
  },
  addContainerPage: async ({ sysAdminPage }, use) => {
    const addContainerPage = new AddContainerPage(sysAdminPage);
    await use(addContainerPage);
  },
  editContainerPage: async ({ sysAdminPage }, use) => {
    const editContainerPage = new EditContainerPage(sysAdminPage);
    await use(editContainerPage);
  },
});

test.describe('container', () => {
  const containersToBeDeleted: string[] = [];

  test.afterEach(async ({ containersAdminPage }) => {
    await containersAdminPage.deleteContainers(containersToBeDeleted);
  });

  test('Create a container via the create button in the header of the admin home page', async ({
    adminHomePage,
    addContainerPage,
    editContainerPage,
    containersAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-292',
    });

    const containerName = FakeDataFactory.createFakeContainerName();
    containersToBeDeleted.push(containerName);

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the container', async () => {
      await adminHomePage.createContainerUsingHeaderCreateButton();
      await adminHomePage.page.waitForURL(addContainerPage.pathRegex);

      await addContainerPage.nameInput.fill(containerName);
      await addContainerPage.saveChangesButton.click();
      await addContainerPage.page.waitForURL(editContainerPage.pathRegex);
    });

    await test.step('Verify the container was created', async () => {
      await containersAdminPage.goto();

      const containerRow = containersAdminPage.containerGrid.getByRole('row', { name: containerName });

      await expect(containerRow).toBeVisible();
    });

    expect(true).toBeTruthy();
  });

  test('Create a container via the create button on the Dashboards tile on the admin home page', async ({
    adminHomePage,
    addContainerPage,
    editContainerPage,
    containersAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-293',
    });

    const containerName = FakeDataFactory.createFakeContainerName();
    containersToBeDeleted.push(containerName);

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the container', async () => {
      await adminHomePage.createContainerUsingDashboardTileButton();
      await adminHomePage.page.waitForURL(addContainerPage.pathRegex);

      await addContainerPage.nameInput.fill(containerName);
      await addContainerPage.saveChangesButton.click();
      await addContainerPage.page.waitForURL(editContainerPage.pathRegex);
    });

    await test.step('Verify the container was created', async () => {
      await containersAdminPage.goto();

      const containerRow = containersAdminPage.containerGrid.getByRole('row', { name: containerName });

      await expect(containerRow).toBeVisible();
    });

    expect(true).toBeTruthy();
  });

  test('Create a container via the "Create Container" button on the Containers home page', async ({
    containersAdminPage,
    addContainerPage,
    editContainerPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-294',
    });

    const containerName = FakeDataFactory.createFakeContainerName();
    containersToBeDeleted.push(containerName);

    await test.step('Navigate to the containers home page', async () => {
      await containersAdminPage.goto();
    });

    await test.step('Create the container', async () => {
      await containersAdminPage.createContainerButton.click();
      await containersAdminPage.page.waitForURL(addContainerPage.pathRegex);

      await addContainerPage.nameInput.fill(containerName);
      await addContainerPage.saveChangesButton.click();
      await addContainerPage.page.waitForURL(editContainerPage.pathRegex);
    });

    await test.step('Verify the container was created', async () => {
      await containersAdminPage.goto();

      const containerRow = containersAdminPage.containerGrid.getByRole('row', { name: containerName });

      await expect(containerRow).toBeVisible();
    });
  });

  test('Update a container', async ({ adminHomePage, addContainerPage, editContainerPage, containersAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-298',
    });

    const containerName = FakeDataFactory.createFakeContainerName();
    const updatedContainerName = `${containerName} Updated`;
    containersToBeDeleted.push(updatedContainerName);

    let containerId: number;

    await test.step('Navigate to the admin home page', async () => {
      await adminHomePage.goto();
    });

    await test.step('Create the container to update', async () => {
      await adminHomePage.createContainer();
      await adminHomePage.page.waitForURL(addContainerPage.pathRegex);

      await addContainerPage.nameInput.fill(containerName);
      await addContainerPage.saveChangesButton.click();
      await addContainerPage.page.waitForURL(editContainerPage.pathRegex);
      containerId = editContainerPage.getIdFromUrl();
    });

    await test.step('Verify the container was created', async () => {
      await containersAdminPage.goto();

      const containerRow = containersAdminPage.containerGrid.getByRole('row', { name: containerName });

      await expect(containerRow).toBeVisible();
    });

    await test.step('Update the container', async () => {
      await editContainerPage.goto(containerId);
      await editContainerPage.nameInput.clear();
      await editContainerPage.nameInput.pressSequentially(updatedContainerName);
      await editContainerPage.save();
    });

    await test.step('Verify the container was updated', async () => {
      await containersAdminPage.goto();

      const containerRow = containersAdminPage.containerGrid.getByRole('row', { name: updatedContainerName });

      await expect(containerRow).toBeVisible();
    });
  });

  test('Delete a container', async ({ containersAdminPage, addContainerPage, editContainerPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-299',
    });

    const containerName = FakeDataFactory.createFakeContainerName();

    await test.step('Navigate to the containers home page', async () => {
      await containersAdminPage.goto();
    });

    await test.step('Create the container to delete', async () => {
      await containersAdminPage.createContainerButton.click();
      await containersAdminPage.page.waitForURL(addContainerPage.pathRegex);
      await addContainerPage.nameInput.fill(containerName);
      await addContainerPage.saveChangesButton.click();
      await addContainerPage.page.waitForURL(editContainerPage.pathRegex);
    });

    await test.step('Delete the container', async () => {
      await containersAdminPage.deleteContainers([containerName]);
    });

    await test.step('Verify the container was deleted', async () => {
      const containerRow = containersAdminPage.containerGrid.getByRole('row', { name: containerName });

      await expect(containerRow).toBeHidden();
    });
  });
});
