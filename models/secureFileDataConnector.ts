import path from 'path';
import { DataConnector, DataConnectorObject } from './dataConnector';

type FileType =
  | 'CSV (Comma delimited)'
  | 'XLSX (Microsoft Excel)'
  | 'JSON (JavaScript Object Notation)'
  | 'XML (Extensible Markup Language)';

type Authentication =
  | {
      type: 'Username / Password';
      username?: string;
      password?: string;
    }
  | {
      type: 'SSH Key';
      privateKey: string;
      username?: string;
      password?: string;
    };

type RecordHandling =
  | {
      type: 'Add new content for each record in the file';
    }
  | {
      type: 'Update only content records that match';
      sourceMatchField: string;
      appMatchField: string;
    }
  | {
      type: 'Update content that matches and add new content';
      sourceMatchField: string;
      appMatchField: string;
      workflow:
        | 'Fail the import if any matching records are in workflow'
        | 'Discard current workflow changes for matching records';
    };

type Messaging =
  | 'All records must follow messaging rules'
  | 'Only new records must follow messaging rules'
  | 'Only updated records must follow messaging rules'
  | 'Do not send messages';

type Frequency = 'Every X Minutes' | 'Every X Hour(s)' | 'Every Day' | 'Every Weekday' | 'Every Week' | 'Every Month';

type MessageCenterSettings = 'Email And Message Center Alerts' | 'Message Center Alerts Only';

type SecureFileDataConnectorObject = Omit<DataConnectorObject, 'type'> & {
  app: string;
  hostname: string;
  port: number;
  fileLocation: string;
  fileName: string;
  fileType: FileType;
  hasHeaderRow?: boolean;
  trimLeadingSpaces?: boolean;
  trimTrailingSpaces?: boolean;
  authType: Authentication;
  fieldMapping?: Record<string, string>[];
  recordHandling?: RecordHandling;
  messaging?: Messaging;
  fieldsToDefault?: string[];
  startingOnDate: Date;
  endingOnDate?: Date;
  frequency: Frequency;
  notificationGroups?: string[];
  notificationUsers?: string[];
  messagingCenterSettings?: MessageCenterSettings;
  childConnectors?: string[];
};

export class SecureFileDataConnector extends DataConnector {
  app: string;
  hostname: string;
  port: number;
  fileLocation: string;
  fileName: string;
  fileType: FileType;
  hasHeaderRow: boolean;
  trimLeadingSpaces: boolean;
  trimTrailingSpaces: boolean;
  authType: Authentication;
  fieldMapping: Record<string, string>[];
  recordHandling: RecordHandling;
  messaging: Messaging;
  fieldsToDefault: string[];
  startingOnDate: Date;
  endingOnDate?: Date;
  frequency: Frequency;
  notificationGroups: string[];
  notificationUsers: string[];
  messagingCenterSettings: MessageCenterSettings;
  childConnectors: string[];

  constructor({
    name,
    description,
    status,
    app,
    hostname,
    port,
    fileLocation,
    fileName,
    fileType,
    hasHeaderRow = true,
    trimLeadingSpaces = false,
    trimTrailingSpaces = false,
    authType = { type: 'Username / Password' },
    fieldMapping = [],
    recordHandling = { type: 'Add new content for each record in the file' },
    messaging = 'All records must follow messaging rules',
    fieldsToDefault = [],
    startingOnDate,
    endingOnDate,
    frequency,
    notificationGroups = [],
    notificationUsers = [],
    messagingCenterSettings = 'Email And Message Center Alerts',
    childConnectors = [],
  }: SecureFileDataConnectorObject) {
    super({ name, description, status, type: 'Secure File Data Connector' });
    this.app = app;
    this.hostname = hostname;
    this.port = port;
    this.fileLocation = fileLocation;
    this.fileName = fileName;
    this.fileType = fileType;
    this.hasHeaderRow = hasHeaderRow;
    this.trimLeadingSpaces = trimLeadingSpaces;
    this.trimTrailingSpaces = trimTrailingSpaces;
    this.authType = authType;
    this.fieldMapping = fieldMapping;
    this.recordHandling = recordHandling;
    this.messaging = messaging;
    this.fieldsToDefault = fieldsToDefault;
    this.startingOnDate = startingOnDate;
    this.endingOnDate = endingOnDate;
    this.frequency = frequency;
    this.notificationGroups = notificationGroups;
    this.notificationUsers = notificationUsers;
    this.messagingCenterSettings = messagingCenterSettings;
    this.childConnectors = childConnectors;

    if (this.status && this.notificationUsers.length === 0 && this.notificationGroups.length === 0) {
      throw new Error(
        'Secure File Data Connector must have at least one notification user or one notification group when enabled.'
      );
    }
  }

  filePath() {
    return path.join(this.fileLocation, this.fileName);
  }
}
