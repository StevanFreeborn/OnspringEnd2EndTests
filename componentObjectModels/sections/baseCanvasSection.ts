import { FrameLocator, Locator } from '@playwright/test';

export abstract class BaseCanvasSection {
  protected readonly section: Locator;
  readonly layoutItemDropzone: Locator;

  constructor(frame: FrameLocator) {
    this.section = frame.locator('.canvas-section').first();
    this.layoutItemDropzone = this.section.locator('#dropLocation');
  }
}
