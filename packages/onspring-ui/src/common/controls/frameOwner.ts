import { FrameLocator, Page } from '@playwright/test';

export type FrameOwner = string | ((page: Page) => Page | FrameLocator);

export function resolveFrameOwner(page: Page, frameOwner?: FrameOwner): Page | FrameLocator {
  if (frameOwner === undefined) {
    return page;
  }

  return typeof frameOwner === 'string' ? page.frameLocator(frameOwner) : frameOwner(page);
}
