import { FormulaField, FormulaFieldObject } from './formulaField';

type NumberFormulaFieldObject = Omit<FormulaFieldObject, 'outputType'>;

export class NumberFormulaField extends FormulaField {
  constructor({ id = 0, name, formula, permissions = [] }: NumberFormulaFieldObject) {
    super({ id, name, permissions, outputType: 'Numeric', formula });
  }
}
