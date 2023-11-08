import { Locator, Page } from '@playwright/test';
import { toPascalCase } from '../utils';
import { BasePage } from './basePage';

export class BaseFormPage extends BasePage {
  readonly saveRecordButton: Locator;
  createFormControlSelector(field: string, controlSelector = 'input') {
    const pascalCaseFieldName = toPascalCase(field);
    return `td.data-${pascalCaseFieldName} ${controlSelector}`;
  }

  protected constructor(page: Page) {
    super(page);
    this.saveRecordButton = page.getByRole('link', { name: 'Save Record' });
  }
}
