import { Message, MessageObject } from './message';

export type EmailSubscription = 'Required' | 'Optional';
export type EmailPriority = 'Normal' | 'High' | 'Low';
export type SendOnSaveOption = 'Always' | 'Only When Record Added' | 'Never (Reminders Only)';

type EmailBodyObject = MessageObject & {
  subject: string;
  body: string;
  fromName: string;
  fromAddress: string;
  template?: string;
  allowDownloads?: boolean;
  recordLinkText?: string;
  emailAddressesInTextField?: string;
  specificExternalUsers?: string[];
  optInCertification?: boolean;
  subscription?: EmailSubscription;
  priority?: EmailPriority;
};

export class EmailBody extends Message {
  readonly subject: string;
  readonly body: string;
  readonly fromName: string;
  readonly fromAddress: string;
  readonly template: string;
  readonly recordLinkText: string;
  readonly allowDownloads: boolean;
  readonly emailAddressesInTextField: string;
  readonly specificExternalUsers: string[];
  readonly optInCertification: boolean;
  readonly subscription: EmailSubscription;
  readonly priority: EmailPriority;

  constructor({
    id = 0,
    name,
    appName,
    subject,
    body,
    fromName,
    fromAddress,
    status = true,
    description = '',
    template = 'None',
    recordLinkText = '',
    allowDownloads = false,
    recipientsBasedOnFields = [],
    specificGroups = [],
    specificUsers = [],
    emailAddressesInTextField = '',
    specificExternalUsers = [],
    optInCertification = false,
    subscription = 'Required',
    priority = 'Normal',
    sendOnSave = 'Always',
    enableReminders = false,
    reminderDateField = '',
    reminders = [],
    sendLogic,
  }: EmailBodyObject) {
    super({
      id,
      appName,
      name,
      status,
      description,
      recipientsBasedOnFields,
      specificGroups,
      specificUsers,
      sendOnSave,
      enableReminders,
      reminderDateField,
      reminders,
      sendLogic,
    });
    this.subject = subject;
    this.body = body;
    this.fromName = fromName;
    this.fromAddress = fromAddress;
    this.template = template;
    this.allowDownloads = allowDownloads;
    this.recordLinkText = recordLinkText;
    this.emailAddressesInTextField = emailAddressesInTextField;
    this.specificExternalUsers = specificExternalUsers;
    this.optInCertification = optInCertification;
    this.subscription = subscription;
    this.priority = priority;

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
