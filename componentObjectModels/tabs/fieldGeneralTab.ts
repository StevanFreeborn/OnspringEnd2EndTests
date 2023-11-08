import { FrameLocator, Locator } from '@playwright/test';
import { LayoutItem } from '../../models/layoutItem';

export abstract class FieldGeneralTab {
  readonly fieldInput: Locator;

  protected constructor(frame: FrameLocator) {
    this.fieldInput = frame.getByLabel('Field', { exact: true });
  }

  abstract fillOutGeneralTab(field: LayoutItem): Promise<void>;
}
