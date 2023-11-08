import { FormulaField, FormulaFieldObject } from './formulaField';

type DateFormulaFieldObject = Omit<FormulaFieldObject, 'outputType'>;

export class DateFormulaField extends FormulaField {
  constructor({ id = 0, name, formula, permissions = [] }: DateFormulaFieldObject) {
    super({ id, name, permissions, outputType: 'Date/Time', formula });
  }
}
