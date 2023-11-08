import { FrameLocator, Locator } from '@playwright/test';
import { LayoutItem } from '../../models/layoutItem';

export abstract class FieldGeneralTab {
  protected readonly frame: FrameLocator;
  readonly fieldInput: Locator;

  protected constructor(frame: FrameLocator) {
    this.frame = frame;
    this.fieldInput = this.frame.getByLabel('Field', { exact: true });
  }

  abstract fillOutGeneralTab(field: LayoutItem): Promise<void>;
}
