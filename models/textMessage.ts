import { Message, MessageObject } from './message';

type TextMessageObject = MessageObject & {
  fromNumber: string;
  message: string;
};

export class TextMessage extends Message {
  fromNumber: string;
  message: string;

  constructor({
    id = 0,
    appName,
    name,
    description = '',
    status = true,
    fromNumber,
    message,
    recipientsBasedOnFields = [],
    specificGroups = [],
    specificUsers = [],
    sendOnSave = 'Always',
    enableReminders = false,
    reminderDateField = '',
    reminders = [],
    sendLogic,
  }: TextMessageObject) {
    super({
      id,
      appName,
      name,
      description,
      status,
      recipientsBasedOnFields,
      specificGroups,
      specificUsers,
      sendOnSave,
      enableReminders,
      reminderDateField,
      reminders,
      sendLogic,
    });
    this.fromNumber = fromNumber;
    this.message = message;

    if (this.fromNumber === '') {
      throw new Error('From Number cannot be empty');
    }

    if (this.message === '') {
      throw new Error('Message is cannot be empty');
    }
  }
}
