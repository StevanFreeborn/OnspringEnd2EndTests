import { RuleLogic } from './ruleLogic';

type DataOption = 'Content Only' | 'Versions Only' | 'Content and Versions';

type MessageCenterSettings = 'Email and Message Center Alerts' | 'Message Center Alerts Only';

type RecordRetentionRuleObject = {
  name: string;
  ruleSet: RuleLogic;
  status?: boolean;
  description?: string;
  data?: DataOption;
  notify?: boolean;
  recipients?: string[];
  exportFields?: string[];
  messageCenterSetting?: MessageCenterSettings;
};

export class RecordRetentionRule {
  name: string;
  ruleSet: RuleLogic;
  status: boolean;
  description: string;
  data: DataOption;
  notify: boolean;
  recipients: string[];
  exportFields: string[];
  messageCenterSetting: MessageCenterSettings;

  constructor({
    name,
    ruleSet,
    status = false,
    description = '',
    data = 'Content Only',
    notify = false,
    recipients = [],
    exportFields = [],
    messageCenterSetting = 'Email and Message Center Alerts',
  }: RecordRetentionRuleObject) {
    this.name = name;
    this.ruleSet = ruleSet;
    this.status = status;
    this.description = description;
    this.data = data;
    this.notify = notify;
    this.recipients = recipients;
    this.exportFields = exportFields;
    this.messageCenterSetting = messageCenterSetting;

    if (this.notify) {
      if (this.recipients.length === 0) {
        throw new Error('At least one recipient must be specified when notifications are enabled.');
      }

      if (this.exportFields.length === 0) {
        throw new Error('At least one export field must be specified when notifications are enabled.');
      }
    }
  }
}
