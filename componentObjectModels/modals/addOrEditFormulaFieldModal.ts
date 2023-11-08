import { Page } from '@playwright/test';
import { FormulaFieldGeneralTab } from '../tabs/formulaFieldGeneralTab';
import { AddOrEditLayoutItemModal } from './addOrEditLayoutItemModal';

export class AddOrEditFormulaFieldModal extends AddOrEditLayoutItemModal {
  readonly generalTab: FormulaFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new FormulaFieldGeneralTab(this.frame);
  }
}
