import { FrameLocator, Locator } from '@playwright/test';
import { Question } from '../../models/question';

export class BaseAddOrEditQuestionForm {
  readonly questionTextEditor: Locator;
  readonly questionIdInput: Locator;
  readonly requiredCheckbox: Locator;
  readonly correctnessCheckbox: Locator;
  readonly relateToContentCheckbox: Locator;
  readonly helpTextEditor: Locator;
  readonly dragBar: Locator;

  constructor(frame: FrameLocator) {
    this.questionTextEditor = frame.getByLabel('Question Text');
    this.questionIdInput = frame.getByLabel('Question Id');
    this.requiredCheckbox = frame.getByLabel('Required');
    this.correctnessCheckbox = frame.getByLabel('Correctness');
    this.relateToContentCheckbox = frame.getByLabel('Relate to Content');
    this.helpTextEditor = frame.locator('.content-area.mce-content-body').last();
    this.dragBar = frame.locator('.survey-item.edit-mode .drag-bar');
  }

  protected async baseFillOutForm(question: Question) {
    await this.questionIdInput.fill(question.questionId);
    await this.questionTextEditor.fill(question.questionText);
    await this.helpTextEditor.fill(question.helpText);

    if (question.required) {
      await this.requiredCheckbox.check();
    }

    if (question.correctness) {
      await this.correctnessCheckbox.check();
    }

    if (question.relateToContent) {
      await this.relateToContentCheckbox.check();
    }
  }

  protected async baseClearForm() {
    await this.questionIdInput.clear();
    await this.questionTextEditor.clear();
    await this.helpTextEditor.clear();
    await this.requiredCheckbox.uncheck();
    await this.correctnessCheckbox.uncheck();
    await this.relateToContentCheckbox.uncheck();
  }

  async fillOutForm(question: Question) {
    await this.baseFillOutForm(question);
  }

  async clearForm() {
    await this.baseClearForm();
  }
}
