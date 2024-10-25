import { FrameLocator, Locator } from '@playwright/test';
import { RelatedData, Report } from '../../models/report';

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

  private async addFieldToDisplay(fieldName: string) {
    const draggable = this.fieldsBank.locator(`.draggable:visible:has-text("${fieldName}")`);
    const dropzone = this.displayFields.locator('[data-column]').last();
    const isDisabled = await draggable.getAttribute('class');

    if (isDisabled?.includes('ui-draggable-disabled')) {
      return;
    }

    await draggable.dragTo(dropzone);
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
