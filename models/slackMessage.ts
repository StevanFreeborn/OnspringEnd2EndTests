import { Message, MessageObject } from './message';

type SlackMessageObject = MessageObject & {
  message: string;
  channelName: string;
  messageTitle: string;
  appendViewRecordButton?: boolean;
  sidebarColor?: string;
};

export class SlackMessage extends Message {
  message: string;
  channelName: string;
  messageTitle: string;
  appendViewRecordButton: boolean;
  sidebarColor: string;

  constructor({
    id = 0,
    appName,
    name,
    description = '',
    status = true,
    message,
    channelName,
    messageTitle,
    appendViewRecordButton = false,
    sidebarColor = '',
    recipientsBasedOnFields = [],
    specificGroups = [],
    specificUsers = [],
    sendOnSave = 'Always',
    enableReminders = false,
    reminderDateField = '',
    reminders = [],
    sendLogic,
  }: SlackMessageObject) {
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
    this.message = message;
    this.channelName = channelName;
    this.messageTitle = messageTitle;
    this.appendViewRecordButton = appendViewRecordButton;
    this.sidebarColor = sidebarColor;

    if (this.message === '') {
      throw new Error('Message cannot be empty');
    }
  }
}
