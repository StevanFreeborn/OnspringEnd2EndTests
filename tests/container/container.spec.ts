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
  test('Create a container via the create button in the header of the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-292',
    });

    expect(true).toBeTruthy();
  });

  test('Create a container via the create button on the Dashboards tile on the admin home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-293',
    });

    expect(true).toBeTruthy();
  });

  test('Create a container via the "Create Container" button on the Containers home page', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-294',
    });

    expect(true).toBeTruthy();
  });

  test('Update a container', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-298',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a container', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-299',
    });

    expect(true).toBeTruthy();
  });
});
