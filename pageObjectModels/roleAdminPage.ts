import { Locator, Page } from '@playwright/test';
import { toPascalCase } from '../utils';
import { BaseAdminPage } from './baseAdminPage';

export class RoleAdminPage extends BaseAdminPage {
  readonly nameInput: Locator;
  readonly saveRecordButton: Locator;
  readonly statusSwitch: Locator;
  readonly statusToggle: Locator;

  createFormControlSelector(field: string, controlSelector = 'input') {
    const pascalCaseFieldName = toPascalCase(field);
    return `td.data-${pascalCaseFieldName} ${controlSelector}`;
  }

  constructor(page: Page) {
    super(page);
    this.nameInput = page.locator(this.createFormControlSelector('Name'));
    this.saveRecordButton = page.getByRole('link', { name: 'Save Record' });
    this.statusSwitch = page.getByRole('switch');
    this.statusToggle = page
      .locator(this.createFormControlSelector('Status', 'div.type-checkbox'))
      .getByRole('switch')
      .locator('span')
      .nth(3);
  }
}
