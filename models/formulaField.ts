import { LayoutItem, LayoutItemObject } from './layoutItem';

export type FormulaOutputType = 'Text' | 'Numeric' | 'Date/Time' | 'List Value';

export type FormulaFieldObject = Omit<LayoutItemObject, 'type'> & {
  outputType: FormulaOutputType;
  formula: string;
};

export class FormulaField extends LayoutItem {
  readonly outputType: FormulaOutputType;
  readonly formula: string;

  protected constructor({ id = 0, name, permissions = [], outputType, formula }: FormulaFieldObject) {
    super({ id, name, permissions, type: 'Formula' });
    this.outputType = outputType;
    this.formula = formula;
  }
}
