import { FrameLocator } from '@playwright/test';

export class BaseDesignerTab {
  readonly frame: FrameLocator;

  protected constructor(frame: FrameLocator) {
    this.frame = frame;
  }

  getAddButton(buttonTitle: string) {
    return this.frame.getByTitle(buttonTitle);
  }

  getFilterInput(placeholder: string) {
    return this.frame.getByPlaceholder(placeholder);
  }
}
