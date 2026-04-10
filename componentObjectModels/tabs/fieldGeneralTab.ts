import { FrameLocator, Locator } from '@playwright/test';
import { LayoutItem } from '../../models/layoutItem';
import { StatusButtonControl } from '../controls/statusButtonControl';

export abstract class FieldGeneralTab {
  protected readonly frame: FrameLocator;
  readonly fieldInput: Locator;
  readonly statusButtonControl: StatusButtonControl;

  protected constructor(frame: FrameLocator) {
    this.frame = frame;
    this.fieldInput = this.frame.getByLabel('Field', { exact: true });
    this.statusButtonControl = new StatusButtonControl(this.frame.locator('.label:has-text("Status") + .data'));
  }

  abstract fillOutGeneralTab(field: LayoutItem): Promise<void>;
}
