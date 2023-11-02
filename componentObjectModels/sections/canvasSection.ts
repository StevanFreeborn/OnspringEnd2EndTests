import { FrameLocator, Locator } from '@playwright/test';

export class CanvasSection {
  private readonly section: Locator;

  constructor(frame: FrameLocator) {
    this.section = frame.locator('.canvas-section').first();
  }
}
