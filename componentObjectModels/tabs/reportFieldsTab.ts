import { FrameLocator, Locator } from '@playwright/test';
import { DisplayField, RelatedData, Report } from '../../models/report';

export class ReportFieldsTab {
  private readonly frame: FrameLocator;
  private readonly displayFields: Locator;
  private readonly fieldsBank: Locator;
  private readonly appNav: Locator;
  private readonly addRelatedDataModal: Locator;

  constructor(frame: FrameLocator) {
    this.frame = frame;
    this.displayFields = this.frame.locator('.display-field-container');
    this.fieldsBank = this.frame.locator('.item-lists');
    this.appNav = this.frame.locator('#nav-apps');
    this.addRelatedDataModal = this.frame.locator('.add-app-popover');
  }

  private async addFieldToDisplay(field: DisplayField) {
    const draggable = this.fieldsBank.locator(`.draggable:visible:has-text("${field.name}")`);
    const dropzone = this.displayFields.locator('[data-column]').last();
    const draggableClasses = await draggable.getAttribute('class');
    const form = this.displayFields
      .locator('.display-field', { has: this.frame.locator(`[data-field-id]:has-text("${field.name}")`) })
      .last();
    const displayFieldForm = new DisplayFieldForm(form, this.frame);

    if (draggableClasses?.includes('ui-draggable-disabled')) {
      await displayFieldForm.fillOutForm(field);
      return;
    }

    await draggable.dragTo(dropzone);

    await displayFieldForm.fillOutForm(field);
  }

  private async addRelatedData(relationshipName: string, data: RelatedData) {
    const app = this.appNav.locator('.app-node').filter({ hasText: relationshipName });
    await app.getByTitle('Add Related App/Survey').click();

    await this.addRelatedDataModal.getByRole('listbox').click();
    await this.frame.getByRole('option', { name: data.referenceField }).click();
    await this.addRelatedDataModal.getByRole('link', { name: 'Add' }).click();

    for (const field of data.displayFields) {
      await this.addFieldToDisplay(field);
    }
  }

  async fillOutForm(report: Report) {
    for (const field of report.displayFields) {
      await this.addFieldToDisplay(field);
    }

    for (const data of report.relatedData) {
      await this.addRelatedData(report.appName, data);
    }
  }
}

class DisplayFieldForm {
  private readonly frame: FrameLocator;
  private readonly form: Locator;
  private readonly aliasInput: Locator;
  private readonly displaySelector: Locator;
  private readonly sortSelector: Locator;

  constructor(form: Locator, frame: FrameLocator) {
    this.frame = frame;
    this.form = form;
    this.aliasInput = this.form.locator('[data-report-field-alias]');
    this.displaySelector = this.form.getByRole('listbox').first();
    this.sortSelector = this.form.getByRole('listbox').last();
  }

  private async selectDisplay(display: string) {
    await this.displaySelector.click();
    await this.frame.getByRole('option', { name: display }).click();
  }

  private async selectSort(sort: string) {
    const span = this.sortSelector.locator('span').first();
    const spanClasses = await span.getAttribute('class');
    const isDisabled = spanClasses?.includes('k-state-disabled');

    if (isDisabled) {
      return;
    }

    await this.sortSelector.click();
    await this.frame.getByRole('option', { name: sort }).click();
  }

  async fillOutForm(field: DisplayField) {
    await this.aliasInput.fill(field.alias);
    await this.selectDisplay(field.display);
    await this.selectSort(field.sort);
  }
}
