import { Locator } from '@playwright/test';

export class ImageFieldControl {
  readonly control: Locator;
  readonly dropzone: Locator;
  readonly browseButton: Locator;

  constructor(imageField: Locator) {
    this.control = imageField;
    this.dropzone = imageField.locator('.image-dropzone');
    this.browseButton = imageField.locator('.k-upload-button');
  }
}
