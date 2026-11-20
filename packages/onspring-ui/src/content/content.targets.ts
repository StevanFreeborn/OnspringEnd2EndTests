import { Locator, Page } from '@playwright/test';

function toPascalCase(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export const ContentRecordTargets = {
  addRoute: (appId: number) => `/Content/${appId}/Add`,
  addPathRegex: /\/Content\/\d+\/Add/,
  editPathRegex: /\/Content\/\d+\/\d+\/Edit/,
  appContentPathRegex: /\/Content\/\d+\/App/,
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
