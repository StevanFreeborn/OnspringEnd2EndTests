import { FrameLocator, Locator } from '@playwright/test';

export class FieldGeneralTab {
  readonly fieldInput: Locator;

  constructor(frame: FrameLocator) {
    this.fieldInput = frame.getByLabel('Field', { exact: true });
  }
}
