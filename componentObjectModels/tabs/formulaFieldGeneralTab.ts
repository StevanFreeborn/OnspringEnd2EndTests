import { FrameLocator, Locator } from '@playwright/test';
import { FormulaField, FormulaOutputType } from '../../models/formulaField';
import { FieldGeneralTab } from './fieldGeneralTab';

export class FormulaFieldGeneralTab extends FieldGeneralTab {
  readonly outputTypeSelect: Locator;
  readonly formulaEditor: Locator;

  constructor(frame: FrameLocator) {
    super(frame);
    this.outputTypeSelect = this.frame.getByRole('listbox', { name: 'Output Type' });
    this.formulaEditor = this.frame.locator('.CodeMirror').first();
  }

  async selectOutputType(outputType: FormulaOutputType) {
    await this.outputTypeSelect.click();
    await this.frame.getByRole('option', { name: outputType }).click();
  }

  async fillOutGeneralTab(formulaField: FormulaField) {
    await this.fieldInput.fill(formulaField.name);
    await this.selectOutputType(formulaField.outputType);

    // There does not appear to be any other way to set the value of a CodeMirror editor
    // than to use the CodeMirror API directly.
    await this.formulaEditor.evaluate(
      (el: HTMLElement & { CodeMirror: { setValue: (value: string) => void } }, formula) => {
        el.CodeMirror.setValue(formula);
      },
      formulaField.formula
    );
  }
}
