type SendingNumberCountry = 'United States (+1)' | 'Canada (+1)' | 'United Kingdom (+44)';

type SendingNumberDigitPattern = 'Begins With' | 'Contains' | 'Ends With';

type SendingNumberObject = {
  id?: number;
  name: string;
  description?: string;
  isDefault?: boolean;
  country?: SendingNumberCountry;
  digitPattern?: SendingNumberDigitPattern;
  digits?: string;
  smsSendingNumber?: string;
};

export class SendingNumber {
  id: number;
  name: string;
  description: string;
  isDefault: boolean;
  country: SendingNumberCountry;
  digitPattern: SendingNumberDigitPattern;
  digits: string;
  smsSendingNumber: string;

  constructor({
    id = 0,
    name,
    description = '',
    isDefault = false,
    country = 'United States (+1)',
    digitPattern = 'Begins With',
    digits = '',
    smsSendingNumber = '',
  }: SendingNumberObject) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isDefault = isDefault;
    this.country = country;
    this.digitPattern = digitPattern;
    this.digits = digits;
    this.smsSendingNumber = smsSendingNumber;
  }
}
