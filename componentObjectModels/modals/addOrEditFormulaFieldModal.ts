import { Page } from '@playwright/test';
import { FormulaFieldGeneralTab } from '../tabs/formulaFieldGeneralTab';
import { AddOrEditFieldModal } from './addOrEditFieldModal';

export class AddOrEditFormulaFieldModal extends AddOrEditFieldModal {
  readonly generalTab: FormulaFieldGeneralTab;

  constructor(page: Page, frameNumber: number = 0) {
    super(page, frameNumber);
    this.generalTab = new FormulaFieldGeneralTab(this.frame);
  }
}
