import { Locator, Page } from '@playwright/test';
import { toPascalCase } from '../utils';
import { BaseAdminPage } from './baseAdminPage';

export class BaseAdminFormPage extends BaseAdminPage {
  readonly saveRecordButton: Locator;
  createFormControlSelector(field: string, controlSelector = 'input') {
    const pascalCaseFieldName = toPascalCase(field);
    return `td.data-${pascalCaseFieldName} ${controlSelector}`;
  }

  constructor(page: Page) {
    super(page);
    this.saveRecordButton = page.getByRole('link', { name: 'Save Record' });
  }
}