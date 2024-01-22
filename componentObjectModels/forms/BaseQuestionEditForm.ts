import { FrameLocator, Locator } from '@playwright/test';

export abstract class BaseQuestionEditForm {
  readonly questionTextEditor: Locator;
  readonly questionIdInput: Locator;
  readonly requiredCheckbox: Locator;
  readonly correctnessCheckbox: Locator;
  readonly relateToContentCheckbox: Locator;
  readonly helpTextEditor: Locator;
  readonly dragBar: Locator;

  protected constructor(frame: FrameLocator) {
    this.questionTextEditor = frame.getByLabel('Question Text');
    this.questionIdInput = frame.getByLabel('Question Id');
    this.requiredCheckbox = frame.getByLabel('Required');
    this.correctnessCheckbox = frame.getByLabel('Correctness');
    this.relateToContentCheckbox = frame.getByLabel('Relate to Content');
    this.helpTextEditor = frame.locator('.content-area.mce-content-body').last();
    this.dragBar = frame.locator('.survey-item.edit-mode .drag-bar');
  }
}
