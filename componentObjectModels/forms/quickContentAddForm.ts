import { Locator } from '@playwright/test';

export class QuickContentAddForm {
  private readonly form: Locator;
  readonly saveButton: Locator;
  readonly openAfterSaveCheckbox: Locator;

  constructor(form: Locator) {
    this.form = form;
    this.saveButton = this.form.getByRole('button', { name: 'Save' });
    this.openAfterSaveCheckbox = this.form.getByRole('checkbox', { name: 'Open this content record on save' });
  }
}
