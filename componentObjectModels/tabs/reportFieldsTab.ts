import { FrameLocator, Locator } from '@playwright/test';
import { Report } from '../../models/report';

export class ReportFieldsTab {
  private readonly displayFields: Locator;
  private readonly fieldsBank: Locator;

  constructor(frame: FrameLocator) {
    this.displayFields = frame.locator('.display-field-container');
    this.fieldsBank = frame.locator('.item-lists');
  }

  private async addFieldToDisplay(fieldName: string) {
    const draggable = this.fieldsBank.locator(`.draggable:has-text("${fieldName}")`);
    const dropzone = this.displayFields.locator('[data-column]').last();
    const isDisabled = await draggable.getAttribute('class');

    if (isDisabled?.includes('ui-draggable-disabled')) {
      return;
    }

    await draggable.dragTo(dropzone);
  }

  async fillOutForm(report: Report) {
    for (const field of report.displayFields) {
      await this.addFieldToDisplay(field);
    }
  }
}
