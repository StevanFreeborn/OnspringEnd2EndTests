import { FrameLocator, Locator } from '@playwright/test';

export class SurveyPageMenu {
  readonly editPropertiesButton: Locator;
  readonly deleteButton: Locator;

  constructor(frame: FrameLocator) {
    this.editPropertiesButton = frame.getByText('Edit Properties');
    this.deleteButton = frame.getByText('Delete');
  }
}
