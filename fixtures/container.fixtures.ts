import { Page } from '@playwright/test';
import { FakeDataFactory } from '../factories/fakeDataFactory';
import { Container } from '../models/container';
import { AddContainerPage } from '../pageObjectModels/containers/addContainerPage';
import { ContainersAdminPage } from '../pageObjectModels/containers/containersAdminPage';
import { EditContainerPage } from '../pageObjectModels/containers/editContainerPage';

export async function createContainerFixture(
  {
    sysAdminPage,
    containerName = FakeDataFactory.createFakeContainerName(),
  }: { sysAdminPage: Page; containerName?: string },
  use: (r: Container) => Promise<void>
) {
  const { container, cleanup } = await createContainer(sysAdminPage, containerName);
  await use(container);
  await cleanup();
}

async function createContainer(sysAdminPage: Page, containerName: string) {
  const containersAdminPage = new ContainersAdminPage(sysAdminPage);
  const addContainerPage = new AddContainerPage(sysAdminPage);
  const editContainerPage = new EditContainerPage(sysAdminPage);

  await containersAdminPage.goto();
  await containersAdminPage.createContainerButton.click();
  await containersAdminPage.page.waitForURL(addContainerPage.pathRegex);

  await addContainerPage.nameInput.fill(containerName);
  await addContainerPage.saveChangesButton.click();
  await addContainerPage.page.waitForURL(editContainerPage.pathRegex);

  const id = editContainerPage.getIdFromUrl();
  const container = new Container({ id, name: containerName });

  const cleanup = () => containersAdminPage.deleteContainers([containerName]);

  return { container, cleanup };
}
