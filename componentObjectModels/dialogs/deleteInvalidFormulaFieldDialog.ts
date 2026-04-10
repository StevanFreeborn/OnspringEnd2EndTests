import { Page } from '../../fixtures';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteInvalidFormulaFieldDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
