import { FormulaField, FormulaFieldObject } from './formulaField';

type TextFormulaFieldObject = Omit<FormulaFieldObject, 'outputType'>;

export class TextFormulaField extends FormulaField {
  constructor({ id = 0, name, formula, permissions = [] }: TextFormulaFieldObject) {
    super({ id, name, permissions, outputType: 'Text', formula });
  }
}
