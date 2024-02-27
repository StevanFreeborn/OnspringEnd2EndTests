import { Locator, Page } from '@playwright/test';
import 'css.escape';
import { toPascalCase } from '../utils';
import { BaseAdminPage } from './baseAdminPage';

export class BaseAdminFormPage extends BaseAdminPage {
  readonly saveRecordButton: Locator;
  createFormControlSelector(field: string, controlSelector = 'input') {
    const pascalCaseFieldName = CSS.escape(toPascalCase(field));
    return `.data-${pascalCaseFieldName} ${controlSelector}`;
  }

  protected constructor(page: Page) {
    super(page);
    this.saveRecordButton = page.getByRole('link', { name: 'Save Record' });
  }
}
