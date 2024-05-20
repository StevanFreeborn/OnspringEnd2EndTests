import { MessageReminder } from './messageReminder';
import { RuleLogic } from './ruleLogic';
export type SendOnSaveOption = 'Always' | 'Only When Record Added' | 'Never (Reminders Only)';

export type MessageObject = {
  id?: number;
  appName: string;
  name: string;
  status: boolean;
  description?: string;
  recipientsBasedOnFields?: string[];
  specificGroups?: string[];
  specificUsers?: string[];
  sendOnSave?: SendOnSaveOption;
  enableReminders?: boolean;
  reminderDateField?: string;
  reminders?: MessageReminder[];
  sendLogic?: RuleLogic;
};

export abstract class Message {
  id: number;
  appName: string;
  name: string;
  status: boolean;
  description: string;
  recipientsBasedOnFields: string[];
  specificGroups: string[];
  specificUsers: string[];
  sendOnSave: SendOnSaveOption;
  enableReminders: boolean;
  reminderDateField: string;
  reminders: MessageReminder[];
  sendLogic?: RuleLogic;

  protected constructor({
    id = 0,
    appName,
    name,
    status,
    description = '',
    recipientsBasedOnFields = [],
    specificGroups = [],
    specificUsers = [],
    sendOnSave = 'Always',
    enableReminders = false,
    reminderDateField = '',
    reminders = [],
    sendLogic,
  }: MessageObject) {
    this.id = id;
    this.appName = appName;
    this.name = name;
    this.status = status;
    this.description = description;
    this.recipientsBasedOnFields = recipientsBasedOnFields;
    this.specificGroups = specificGroups;
    this.specificUsers = specificUsers;
    this.sendOnSave = sendOnSave;
    this.enableReminders = enableReminders;
    this.reminderDateField = reminderDateField;
    this.reminders = reminders;
    this.sendLogic = sendLogic;

    if (this.name === '') {
      throw new Error('Name cannot be empty');
    }

    if (this.appName === '') {
      throw new Error('App name cannot be empty');
    }
  }
}
