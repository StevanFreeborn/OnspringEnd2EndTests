import { FormulaField, FormulaFieldObject } from './formulaField.js';
import { ListValue } from './listValue.js';

type ListFormulaFieldObject = Omit<FormulaFieldObject, 'outputType'> & {
  values?: ListValue[];
};

export class ListFormulaField extends FormulaField {
  readonly values: ListValue[];

  constructor({ id = 0, name, formula, permissions = [], values = [] }: ListFormulaFieldObject) {
    super({ id, name, permissions, outputType: 'List Value', formula });
    this.values = values;
  }
}
