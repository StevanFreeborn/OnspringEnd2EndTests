import { FrameLocator, Locator, Page } from '@playwright/test';

export class ChangePasswordDialog {
  private readonly frame: FrameLocator;
  readonly newPasswordInput: Locator;
  readonly verifyPasswordInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.frame = page.frameLocator('iframe');
    this.newPasswordInput = this.frame.getByLabel('New Password', { exact: true });
    this.verifyPasswordInput = this.frame.getByLabel('Verify New Password');
    this.saveButton = page.getByRole('button', {
      name: 'Save',
    });
  }
}
