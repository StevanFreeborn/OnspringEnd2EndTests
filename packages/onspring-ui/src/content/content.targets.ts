import { Locator, Page } from '@playwright/test';
import { resolveTarget, Target } from '@stevanfreeborn/screenplay-playwright';

function toPascalCase(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function escapeCssClassPart(text: string): string {
  return text.replace(/([^\w-])/g, '\\$1');
}

const contentContainer = (page: Page): Locator => page.locator('div.contentContainer').first();

export const ContentRecordTargets = {
  addRoute: (appId: number) => `/Content/${appId}/Add`,
  addPathRegex: /\/Content\/\d+\/Add/,
  editPathRegex: /\/Content\/\d+\/\d+\/Edit/,
  appContentPathRegex: /\/Content\/\d+\/App/,
  contentContainer,
  tabStrip: (page: Page): Locator => contentContainer(page).locator('.k-tabstrip-items'),
  horizontalTabButton:
    (tabName: string): Target =>
    (page: Page): Locator =>
      contentContainer(page).getByRole('tab').filter({ hasText: tabName }).first(),
  standaloneSection:
    (sectionName: string): Target =>
    (page: Page): Locator =>
      contentContainer(page)
        .locator('.standalone-section-container section.section')
        .filter({ hasText: sectionName })
        .first(),
  sectionByName:
    (sectionName: string): Target =>
    (page: Page): Locator =>
      contentContainer(page).locator('section.section').filter({ hasText: sectionName }).first(),
  sectionInHorizontalTab:
    (tabId: string, sectionName: string): Target =>
    (page: Page): Locator =>
      contentContainer(page)
        .locator(`section[data-tab-id="${tabId}"]`)
        .first()
        .locator('section.section')
        .filter({ has: page.locator('h1').filter({ hasText: sectionName }) })
        .first(),
  sectionInVerticalTab:
    (tabName: string, sectionName: string): Target =>
    (page: Page): Locator =>
      contentContainer(page)
        .locator('section.tab')
        .filter({ has: contentContainer(page).locator('h1').filter({ hasText: tabName }) })
        .first()
        .locator('section.section')
        .filter({ has: page.locator('h1').filter({ hasText: sectionName }) })
        .first(),
  textFieldInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator => {
      const escapedPascal = escapeCssClassPart(toPascalCase(fieldName));
      return resolveTarget(page, sectionTarget)
        .locator(`.data-${escapedPascal} input[data-field-type="textBox"]`)
        .first();
    },
  saveRecordButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Record' }),
  saveAndCloseButton: (page: Page): Locator => page.getByRole('link', { name: 'Save & Close' }),

  tab:
    (tabName: string) =>
    (page: Page): Locator =>
      page.locator(`section[data-tab-name="${tabName}"]`),

  textField:
    (fieldName: string) =>
    (page: Page): Locator => {
      const pascal = toPascalCase(fieldName);
      return page
        .locator(
          `.data-${pascal} input[data-field-type="textBox"], .data-${pascal} input, [data-field-name="${fieldName}"] input, .data-${fieldName} input`
        )
        .first();
    },
};
