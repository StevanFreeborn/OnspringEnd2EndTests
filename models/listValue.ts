type ListValueObject = {
  value: string;
  numericValue?: number;
  image?: string;
  color?: string;
};

export class ListValue {
  readonly value: string;
  readonly numericValue: number;
  readonly image: string;
  readonly color: string;

  constructor({ value, numericValue = 0, image = '', color = '' }: ListValueObject) {
    this.value = value;
    this.numericValue = numericValue;
    this.image = image;
    this.color = color;
  }
}
