import { Locator } from '@playwright/test';
import { BaseForm, GetFieldParams } from './baseForm';

export class ViewRecordForm extends BaseForm {
  constructor(container: Locator) {
    super(container);
  }

  async getField({ tabName, sectionName, fieldName, fieldType }: GetFieldParams) {
    return await this.getReadOnlyField({ tabName, sectionName, fieldName, fieldType });
  }

  async getImageByFileIdFromField(imageField: Locator, fileId: number) {
    const alLImages = await imageField.locator('.image').all();

    const image = alLImages.find(async image => {
      const src = await image.getAttribute('src');
      return src && src.includes(`fileId=${fileId}`);
    });

    if (image === undefined) {
      throw new Error(`Could not find image with fileId: ${fileId}`);
    }

    return image;
  }

  async getAttachmentByNameFromField(attachmentField: Locator, fileName: string) {
    return attachmentField
      .locator('.k-grid-content tr')
      .filter({
        hasText: fileName,
      })
      .first();
  }
}
