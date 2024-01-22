import { FrameLocator } from '@playwright/test';
import { BaseQuestionEditForm } from './BaseQuestionEditForm';

export class AttachmentQuestionEditForm extends BaseQuestionEditForm {
  constructor(frame: FrameLocator) {
    super(frame);
  }
}
