import { Locator, Page } from '@playwright/test';
import { Target } from '@stevanfreeborn/screenplay-playwright';

const contentFrame = (page: Page) => page.frameLocator('iframe');

export const GettingStartedDashboardTargets = {
  linkByName:
    (name: string): Target =>
    (page: Page): Locator =>
      contentFrame(page).getByRole('link', { name }),
  quickVideoLink:
    (index: number): Target =>
    (page: Page): Locator =>
      contentFrame(page).locator('.quick-videos').getByRole('link').nth(index),
};
