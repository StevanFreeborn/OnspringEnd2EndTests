import { FrameLocator } from '@playwright/test';

export abstract class BaseDesignerTab {
  protected readonly frame: FrameLocator;

  protected constructor(frame: FrameLocator) {
    this.frame = frame;
  }

  protected getAddButton(buttonTitle: string) {
    return this.frame.getByTitle(buttonTitle);
  }

  protected getFilterInput(placeholder: string) {
    return this.frame.getByPlaceholder(placeholder);
  }

  protected getItemBank(name: string) {
    return this.frame.locator(`[data-tab-content="${name}"]`);
  }

  protected getItemFromBank(bankName: string, itemName: string) {
    return this.frame
      .locator(`[data-tab-content="${bankName}"]`)
      .locator('div.layoutItem')
      .filter({ hasText: itemName })
      .first();
  }
}
