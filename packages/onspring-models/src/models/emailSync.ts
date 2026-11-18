type SyncType = 'Import Only';

type Messaging = 'All records must follow messaging rules';

type EmailSyncDataMapping = {
  Body?: string;
  'CC (Email)'?: string;
  'CC (Name)'?: string;
  'From (Email)'?: string;
  'From (Name)'?: string;
  Header?: string;
  'Send Date'?: string;
  Subject?: string;
  'To (Email)'?: string;
  'To (Name)'?: string;
  Attachments?: string;
};

type EmailSyncObject = {
  name: string;
  appOrSurvey: string;
  status?: boolean;
  emailKey: string;
  dataMapping: EmailSyncDataMapping;
  syncType?: SyncType;
  messaging?: Messaging;
};

export class EmailSync {
  name: string;
  appOrSurvey: string;
  status: boolean;
  emailKey: string;
  dataMapping: EmailSyncDataMapping;
  syncType: SyncType;
  messaging: Messaging;

  constructor({
    name,
    appOrSurvey,
    status = false,
    emailKey,
    dataMapping,
    syncType = 'Import Only',
    messaging = 'All records must follow messaging rules',
  }: EmailSyncObject) {
    this.name = name;
    this.appOrSurvey = appOrSurvey;
    this.status = status;
    this.emailKey = emailKey;
    this.dataMapping = dataMapping;
    this.syncType = syncType;
    this.messaging = messaging;

    const hasMapping = Object.values(this.dataMapping).some(
      value => value !== null && value !== undefined && value.trim().length > 0
    );

    if (hasMapping === false) {
      throw new Error('Must have at least one data mapping');
    }
  }
}
