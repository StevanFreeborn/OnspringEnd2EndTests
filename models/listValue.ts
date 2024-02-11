type ListValueObject = {
  value: string;
  numericValue?: number;
  image?: string;
  color?: string;
};

export class BaseListValue {
  readonly value: string;
  readonly numericValue: number;

  constructor({ value, numericValue = 0 }: { value: string; numericValue?: number }) {
    this.value = value;
    this.numericValue = numericValue;
  }
}

export class ListValue extends BaseListValue {
  readonly image: string;
  readonly color: string;

  constructor({ value, numericValue = 0, image = '', color = '' }: ListValueObject) {
    super({ value, numericValue });
    this.image = image;
    this.color = color;
  }
}
