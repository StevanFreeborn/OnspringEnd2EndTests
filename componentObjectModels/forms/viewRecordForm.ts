import { Locator } from '@playwright/test';
import { GetFieldParams } from './addOrEditRecordForm';
import { BaseForm } from './baseForm';

export class ViewRecordForm extends BaseForm {
  constructor(container: Locator) {
    super(container);
  }

  async getField({ tabName, sectionName, fieldName, fieldType }: GetFieldParams) {
    const section = await this.getSection(tabName, sectionName);

    let locator: string;

    switch (fieldType) {
      case 'Reference':
        locator = this.createFormControlSelector(fieldName, 'div.type-reference');
        break;
      case 'Attachment':
        locator = this.createFormControlSelector(fieldName, 'div.type-attachment');
        break;
      case 'Image':
        locator = this.createFormControlSelector(fieldName, 'div.type-image');
        break;
      default:
        locator = this.createFormControlSelector(fieldName, 'div.data-text-only');
        break;
    }

    return section.locator(locator).first();
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
