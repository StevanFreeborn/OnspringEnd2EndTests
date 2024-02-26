import { EmailReminder } from './emailReminder';
import { RuleLogic } from './ruleLogic';

type Status = 'Active' | 'Inactive';
type Subscription = 'Required' | 'Optional';
type Priority = 'Normal' | 'High' | 'Low';
type SendOnSaveOption = 'Always' | 'Only When Record Added' | 'Never (Reminders Only)';

type EmailBodyObject = {
  id?: number;
  name: string;
  appName: string;
  status: Status;
  subject: string;
  body: string;
  fromName: string;
  fromAddress: string;
  description?: string;
  template?: string;
  allowDownloads?: boolean;
  recipientsBasedOnFields?: string[];
  specificGroups?: string[];
  specificUsers?: string[];
  emailAddressesInTextField?: string;
  specificExternalUsers?: string[];
  subscription?: Subscription;
  priority?: Priority;
  sendOnSave?: SendOnSaveOption;
  enableReminders?: boolean;
  reminderDateField: string;
  reminders?: EmailReminder[];
  sendLogic?: RuleLogic;
};

export class EmailBody {
  id: number;
  readonly name: string;
  readonly appName: string;
  readonly status: Status;
  readonly subject: string;
  readonly body: string;
  readonly fromName: string;
  readonly fromAddress: string;
  readonly description: string;
  readonly template: string;
  readonly allowDownloads: boolean;
  readonly recipientsBasedOnFields: string[];
  readonly specificGroups: string[];
  readonly specificUsers: string[];
  readonly emailAddressesInTextField: string;
  readonly specificExternalUsers: string[];
  readonly subscription: Subscription;
  readonly priority: Priority;
  readonly sendOnSave: SendOnSaveOption;
  readonly enableReminders: boolean;
  readonly reminderDateField: string;
  readonly reminders: EmailReminder[];
  readonly sendLogic?: RuleLogic;

  constructor({
    id = 0,
    name,
    appName,
    subject,
    body,
    fromName,
    fromAddress,
    status = 'Active',
    description = '',
    template = 'None',
    allowDownloads = false,
    recipientsBasedOnFields = [],
    specificGroups = [],
    specificUsers = [],
    emailAddressesInTextField = '',
    specificExternalUsers = [],
    subscription = 'Required',
    priority = 'Normal',
    sendOnSave = 'Always',
    enableReminders = false,
    reminderDateField = '',
    reminders = [],
    sendLogic,
  }: EmailBodyObject) {
    this.id = id;
    this.name = name;
    this.appName = appName;
    this.status = status;
    this.subject = subject;
    this.body = body;
    this.fromName = fromName;
    this.fromAddress = fromAddress;
    this.description = description;
    this.template = template;
    this.allowDownloads = allowDownloads;
    this.recipientsBasedOnFields = recipientsBasedOnFields;
    this.specificGroups = specificGroups;
    this.specificUsers = specificUsers;
    this.emailAddressesInTextField = emailAddressesInTextField;
    this.specificExternalUsers = specificExternalUsers;
    this.subscription = subscription;
    this.priority = priority;
    this.sendOnSave = sendOnSave;
    this.enableReminders = enableReminders;
    this.reminderDateField = reminderDateField;
    this.reminders = reminders;
    this.sendLogic = sendLogic;

    if (this.name === '') {
      throw new Error('Email body name cannot be empty');
    }

    if (this.appName === '') {
      throw new Error('App name cannot be empty');
    }

    if (this.subject === '') {
      throw new Error('Subject cannot be empty');
    }

    if (this.body === '') {
      throw new Error('Body cannot be empty');
    }

    if (this.fromName === '') {
      throw new Error('From name cannot be empty');
    }

    if (this.fromAddress === '') {
      throw new Error('From address cannot be empty');
    }

    if (
      this.recipientsBasedOnFields.length === 0 &&
      this.specificGroups.length === 0 &&
      this.specificUsers.length === 0 &&
      this.emailAddressesInTextField === '' &&
      this.specificExternalUsers.length === 0
    ) {
      throw new Error('You must provide at least one recipient');
    }

    if (this.enableReminders && this.reminderDateField === '') {
      throw new Error('You must provide a reminder date field');
    }

    if (this.enableReminders && this.reminders.length === 0) {
      throw new Error('You must provide at least one reminder');
    }
  }
}
