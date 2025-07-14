import { FrameLocator, Locator } from '@playwright/test';
import { FormulaField, FormulaOutputType } from '../../models/formulaField';
import { ListFormulaField } from '../../models/listFormulaField';
import { ListValuesGrid } from '../controls/listValuesGrid';
import { FieldGeneralTab } from './fieldGeneralTab';

export class FormulaFieldGeneralTab extends FieldGeneralTab {
  readonly outputTypeSelect: Locator;
  readonly formulaEditor: Locator;
  readonly listValuesGrid: ListValuesGrid;

  constructor(frame: FrameLocator) {
    super(frame);
    this.outputTypeSelect = this.frame.getByRole('listbox', { name: 'Output Type' });
    this.formulaEditor = this.frame.locator('.CodeMirror').first();
    this.listValuesGrid = new ListValuesGrid(this.frame.locator('.list-values').first(), this.frame);
  }

  async selectOutputType(outputType: FormulaOutputType) {
    await this.outputTypeSelect.click();
    await this.frame.getByRole('option', { name: outputType }).click();
  }

  async fillOutGeneralTab(formulaField: FormulaField) {
    await this.fieldInput.fill(formulaField.name);
    await this.selectOutputType(formulaField.outputType);

    switch (formulaField.outputType) {
      case 'List Value': {
        const listFormulaField = formulaField as ListFormulaField;

        for (const listValue of listFormulaField.values) {
          await this.listValuesGrid.addValue(listValue);
        }

        break;
      }
      default:
        break;
    }

    // There does not appear to be any other way to set the value of a CodeMirror editor
    // than to use the CodeMirror API directly.
    await this.formulaEditor.evaluate(
      async (el: HTMLElement & { CodeMirror: { setValue: (value: string) => void } }, formula) => {
        el.CodeMirror.setValue(formula);
        await new Promise(resolve => setTimeout(resolve, 500));
      },
      formulaField.formula
    );
  }
}
