import { Locator, Page } from '@playwright/test';

export class BaseDeleteDialogComponent {
  readonly overlay: Locator;
  readonly dialog: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.overlay = page.locator('body > div.ui-widget-overlay.ui-front');
    this.dialog = page.locator(
      'body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-dialog-buttons.ui-draggable.warning-dialog'
    );
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
  }

  async waitForDialogToBeDismissed() {
    await Promise.all([
      this.dialog.waitFor({
        state: 'detached',
      }),
      this.overlay.waitFor({ state: 'detached' }),
    ]);
  }
}
