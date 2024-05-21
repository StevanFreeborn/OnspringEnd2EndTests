import { Page } from '@playwright/test';
import { FakeDataFactory } from '../factories/fakeDataFactory';
import { SendingNumber } from '../models/sendingNumber';
import { AdminHomePage } from '../pageObjectModels/adminHomePage';
import { AddSendingNumberPage } from '../pageObjectModels/messaging/addSendingNumberPage';
import { EditSendingNumberPage } from '../pageObjectModels/messaging/editSendingNumberPage';
import { SendingNumberAdminPage } from '../pageObjectModels/messaging/sendingNumberAdminPage';

export async function smsSendingNumber(
  { sysAdminPage }: { sysAdminPage: Page },
  use: (r: SendingNumber) => Promise<void>
) {
  const sendingNumber = await createSendingNumber(sysAdminPage);
  await use(sendingNumber);
  await new SendingNumberAdminPage(sysAdminPage).deleteSendingNumbers([sendingNumber.name]);
}

async function createSendingNumber(sysAdminPage: Page) {
  const adminHomePage = new AdminHomePage(sysAdminPage);
  const addSendingNumberPage = new AddSendingNumberPage(sysAdminPage);
  const editSendingNumberPage = new EditSendingNumberPage(sysAdminPage);
  const sendingNumber = new SendingNumber({
    name: FakeDataFactory.createFakeSendingNumberName(),
  });

  await adminHomePage.goto();
  await adminHomePage.adminNav.adminCreateButton.hover();
  await adminHomePage.adminNav.sendingNumberCreateMenuOption.click();
  await adminHomePage.page.waitForURL(addSendingNumberPage.path);

  const number = await addSendingNumberPage.fillOutForm(sendingNumber);
  await addSendingNumberPage.saveButton.click();
  await adminHomePage.page.waitForURL(editSendingNumberPage.pathRegex);

  sendingNumber.smsSendingNumber = number;
  sendingNumber.id = editSendingNumberPage.getIdFromUrl();
  return sendingNumber;
}
