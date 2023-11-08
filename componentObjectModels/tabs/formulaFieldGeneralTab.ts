import { FrameLocator, Locator } from '@playwright/test';
import { FormulaField, FormulaOutputType } from '../../models/formulaField';
import { FieldGeneralTab } from './fieldGeneralTab';

export class FormulaFieldGeneralTab extends FieldGeneralTab {
  readonly outputTypeSelect: Locator;

  constructor(frame: FrameLocator) {
    super(frame);
    this.outputTypeSelect = frame.getByLabel('Output Type', { exact: true });
  }

  async selectOutputType(outputType: FormulaOutputType) {
    await this.outputTypeSelect.click();
    await this.outputTypeSelect.page().getByRole('option', { name: outputType }).click();
  }

  async fillOutGeneralTab(formulaField: FormulaField) {
    await this.fieldInput.fill(formulaField.name);
    await this.selectOutputType(formulaField.outputType);
  }
}
