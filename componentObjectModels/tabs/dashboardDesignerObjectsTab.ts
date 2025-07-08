import { FrameLocator, Locator } from '@playwright/test';
import { BaseDashboardDesignerTab } from './baseDashboardDesignerTab';

export class DashboardDesignerObjectsTab extends BaseDashboardDesignerTab {
  private readonly getMoreObjectsPathRegex: RegExp;

  constructor(frame: FrameLocator) {
    super(frame);

    this.getMoreObjectsPathRegex = /\/Admin\/Dashboard\/GetMoreObjectListItems/;
  }

  private async isScrolledToBottom(scrollableElement: Locator) {
    return await scrollableElement.evaluate(el => {
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;

      return Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
    });
  }

  async getObjectFromBank(objectName: string) {
    const scrollableElement = this.frame.locator('[data-tab-content="object"]').locator('.item-lists');
    const hasScrollbar = await scrollableElement.evaluate(el => el.scrollHeight > el.clientHeight);
    const item = this.getItemFromBank('object', objectName);

    if (hasScrollbar === false) {
      return item;
    }

    let isBottom = await this.isScrolledToBottom(scrollableElement);

    do {
      if (await item.isVisible()) {
        break;
      }

      const scrollResponse = scrollableElement.page().waitForResponse(this.getMoreObjectsPathRegex);
      await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));

      isBottom = await this.isScrolledToBottom(scrollableElement);

      if (isBottom) {
        break;
      }

      await scrollResponse;
    } while (isBottom === false);

    return item;
  }

  async scrollAllItemsIntoView() {
    const scrollableElement = this.frame.locator('[data-tab-content="object"]').locator('.item-lists');
    const hasScrollbar = await scrollableElement.evaluate(el => el.scrollHeight > el.clientHeight);

    if (hasScrollbar === false) {
      return;
    }

    do {
      const scrollResponse = scrollableElement.page().waitForResponse(this.getMoreObjectsPathRegex);
      await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));

      if (await this.isScrolledToBottom(scrollableElement)) {
        break;
      }

      await scrollResponse;
    } while ((await this.isScrolledToBottom(scrollableElement)) === false);
  }
}
