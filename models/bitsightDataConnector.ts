import { DataConnector, DataConnectorFrequency, DataConnectorObject } from './dataConnector';

type BitsightDataConnectorObject = Omit<DataConnectorObject, 'type'> & {
  apiKey: string;
  appMappings: BitsightAppMapping;
  startingOnDate: Date;
  endingOnDate?: Date;
  frequency: DataConnectorFrequency;
  notificationGroups?: string[];
  notificationUsers?: string[];
};

export class BitsightDataConnector extends DataConnector {
  apiKey: string;
  appMappings: BitsightAppMapping;
  startingOnDate: Date;
  endingOnDate?: Date;
  frequency: DataConnectorFrequency;
  notificationGroups: string[];
  notificationUsers: string[];

  constructor({
    name,
    description,
    status,
    apiKey,
    appMappings,
    startingOnDate,
    endingOnDate,
    frequency,
    notificationGroups = [],
    notificationUsers = [],
  }: BitsightDataConnectorObject) {
    super({ name, description, status, type: 'BitSight Data Connector' });
    this.apiKey = apiKey;
    this.appMappings = appMappings;
    this.startingOnDate = startingOnDate;
    this.endingOnDate = endingOnDate;
    this.frequency = frequency;
    this.notificationGroups = notificationGroups;
    this.notificationUsers = notificationUsers;
  }

  getAllAppMappings() {
    const mappings = [
      this.appMappings.alertsMapping,
      this.appMappings.portfolioMapping,
      this.appMappings.ratingDetailsMapping,
    ];
    const nameMappings: Record<string, string>[] = [];

    for (const mapping of mappings) {
      const keys = Object.keys(mapping);

      for (const key of keys) {
        const value = mapping[key];
        nameMappings.push({ key: value.appName });
      }
    }

    return nameMappings;
  }
}

export class BitsightAppMapping {
  alertsMapping: Record<
    string,
    {
      appName: string;
      mappings: BitsightAlertFieldMapping;
    }
  >;
  portfolioMapping: Record<
    string,
    {
      appName: string;
      mappings: BitsightPortfolioFieldMapping;
    }
  >;
  ratingDetailsMapping: Record<
    string,
    {
      appName: string;
      mappings: BitsightRatingDetailsFieldMapping;
    }
  >;

  constructor({
    alertApp = { appName: '', mappings: new BitsightAlertFieldMapping({}) },
    portfolioApp = { appName: '', mappings: new BitsightPortfolioFieldMapping({}) },
    ratingDetailsApp = { appName: '', mappings: new BitsightRatingDetailsFieldMapping({}) },
  }: {
    alertApp?: { appName: string; mappings: BitsightAlertFieldMapping };
    portfolioApp?: { appName: string; mappings: BitsightPortfolioFieldMapping };
    ratingDetailsApp?: { appName: string; mappings: BitsightRatingDetailsFieldMapping };
  }) {
    this.alertsMapping = { 'BitSight Alerts': alertApp };
    this.portfolioMapping = { 'BitSight Portfolio': portfolioApp };
    this.ratingDetailsMapping = { 'BitSight Rating Details': ratingDetailsApp };
  }
}

type RecordHandlingOption =
  | 'Add new content for each record in the file'
  | 'Update only content records that match'
  | 'Update content that matches and add new content';

type MessagingRuleOption =
  | 'All records must follow messaging rules'
  | 'Only new records must follow messaging rules'
  | 'Only updated records must follow messaging rules'
  | 'Do not send messages';

type FieldMappingObject = {
  recordHandling?: RecordHandlingOption;
  sourceMatchField?: string;
  appMatchField?: string;
  messagingRule?: MessagingRuleOption;
};

abstract class FieldMapping {
  recordHandling: RecordHandlingOption;
  sourceMatchField: string;
  appMatchField: string;
  messagingRule: MessagingRuleOption;

  constructor({
    recordHandling = 'Add new content for each record in the file',
    sourceMatchField = '',
    appMatchField = '',
    messagingRule = 'All records must follow messaging rules',
  }: FieldMappingObject) {
    this.recordHandling = recordHandling;
    this.sourceMatchField = sourceMatchField;
    this.appMatchField = appMatchField;
    this.messagingRule = messagingRule;

    if (
      this.recordHandling !== 'Add new content for each record in the file' &&
      (this.sourceMatchField === '' || this.appMatchField === '')
    ) {
      throw new Error('Source match field and app match field must be provided when updating content');
    }
  }
}

type BitsightAlertFieldMappingObject = FieldMappingObject & {
  alertDateField?: string;
  alertIdField?: string;
  alertTriggerField?: string;
  alertTypeField?: string;
  companyDetailsField?: string;
  companyIdField?: string;
  companyNameField?: string;
  severityField?: string;
};

export class BitsightAlertFieldMapping extends FieldMapping {
  alertDateMapping: Record<string, string>;
  alertIdMapping: Record<string, string>;
  alertTriggerMapping: Record<string, string>;
  alertTypeMapping: Record<string, string>;
  companyDetailsMapping: Record<string, string>;
  companyIdMapping: Record<string, string>;
  companyNameMapping: Record<string, string>;
  severityMapping: Record<string, string>;

  constructor({
    recordHandling,
    sourceMatchField,
    appMatchField,
    messagingRule,
    alertDateField = '',
    alertIdField = '',
    alertTriggerField = '',
    alertTypeField = '',
    companyDetailsField = '',
    companyIdField = '',
    companyNameField = '',
    severityField = '',
  }: BitsightAlertFieldMappingObject) {
    super({ recordHandling, sourceMatchField, appMatchField, messagingRule });
    this.alertDateMapping = { 'Alert Date': alertDateField };
    this.alertIdMapping = { 'Alert ID': alertIdField };
    this.alertTriggerMapping = { 'Alert Trigger': alertTriggerField };
    this.alertTypeMapping = { 'Alert Type': alertTypeField };
    this.companyDetailsMapping = { 'Company Details': companyDetailsField };
    this.companyIdMapping = { 'Company ID': companyIdField };
    this.companyNameMapping = { 'Company Name': companyNameField };
    this.severityMapping = { Severity: severityField };
  }
}

type BitsightPortfolioFieldMappingObject = FieldMappingObject & {
  bulkEmailSenderStatus?: string;
  companyDetails?: string;
  companyIdField?: string;
  companyNameField?: string;
  companyPreviewField?: string;
  customerMonitoringCountField?: string;
  dateAddedField?: string;
  descriptionField?: string;
  folderNameField?: string;
  ipv4CountField?: string;
  medianIndustryRatingField?: string;
  peopleCountField?: string;
  ratingField?: string;
  ratingCategoryField?: string;
  ratingDateField?: string;
  ratingTypeField?: string;
  searchCountField?: string;
  serviceProviderField?: string;
  shortNameField?: string;
  subscriptionTypeField?: string;
  tierField?: string;
};

export class BitsightPortfolioFieldMapping extends FieldMapping {
  bulkEmailSenderStatusMapping: Record<string, string>;
  companyDetailsMapping: Record<string, string>;
  companyIdMapping: Record<string, string>;
  companyNameMapping: Record<string, string>;
  companyPreviewMapping: Record<string, string>;
  customerMonitoringCountMapping: Record<string, string>;
  dateAddedMapping: Record<string, string>;
  descriptionMapping: Record<string, string>;
  folderNameMapping: Record<string, string>;
  ipv4CountMapping: Record<string, string>;
  medianIndustryRatingMapping: Record<string, string>;
  peopleCountMapping: Record<string, string>;
  ratingMapping: Record<string, string>;
  ratingCategoryMapping: Record<string, string>;
  ratingDateMapping: Record<string, string>;
  ratingTypeMapping: Record<string, string>;
  searchCountMapping: Record<string, string>;
  serviceProviderMapping: Record<string, string>;
  shortNameMapping: Record<string, string>;
  subscriptionTypeMapping: Record<string, string>;
  tierMapping: Record<string, string>;

  constructor({
    recordHandling,
    sourceMatchField,
    appMatchField,
    messagingRule,
    bulkEmailSenderStatus = '',
    companyDetails = '',
    companyIdField = '',
    companyNameField = '',
    companyPreviewField = '',
    customerMonitoringCountField = '',
    dateAddedField = '',
    descriptionField = '',
    folderNameField = '',
    ipv4CountField = '',
    medianIndustryRatingField = '',
    peopleCountField = '',
    ratingField = '',
    ratingCategoryField = '',
    ratingDateField = '',
    ratingTypeField = '',
    searchCountField = '',
    serviceProviderField = '',
    shortNameField = '',
    subscriptionTypeField = '',
    tierField = '',
  }: BitsightPortfolioFieldMappingObject) {
    super({ recordHandling, sourceMatchField, appMatchField, messagingRule });
    this.bulkEmailSenderStatusMapping = { 'Bulk Email Sender Status': bulkEmailSenderStatus };
    this.companyDetailsMapping = { 'Company Details': companyDetails };
    this.companyIdMapping = { 'Company ID': companyIdField };
    this.companyNameMapping = { 'Company Name': companyNameField };
    this.companyPreviewMapping = { 'Company Preview': companyPreviewField };
    this.customerMonitoringCountMapping = { 'Customer Monitoring Count': customerMonitoringCountField };
    this.dateAddedMapping = { 'Date Added': dateAddedField };
    this.descriptionMapping = { Description: descriptionField };
    this.folderNameMapping = { 'Folder Name': folderNameField };
    this.ipv4CountMapping = { 'IPV4 Count': ipv4CountField };
    this.medianIndustryRatingMapping = { 'Median Industry Rating': medianIndustryRatingField };
    this.peopleCountMapping = { 'People Count': peopleCountField };
    this.ratingMapping = { Rating: ratingField };
    this.ratingCategoryMapping = { 'Rating Category': ratingCategoryField };
    this.ratingDateMapping = { 'Rating Date': ratingDateField };
    this.ratingTypeMapping = { 'Rating Type': ratingTypeField };
    this.searchCountMapping = { 'Search Count': searchCountField };
    this.serviceProviderMapping = { 'Service Provider': serviceProviderField };
    this.shortNameMapping = { 'Short Name': shortNameField };
    this.subscriptionTypeMapping = { 'Subscription Type': subscriptionTypeField };
    this.tierMapping = { Tier: tierField };
  }
}

type BitsightRatingDetailsFieldMappingObject = FieldMappingObject & {
  categoryOrderField?: string;
  companyDetailsField?: string;
  companyIdField?: string;
  companyNameField?: string;
  gradeColorField?: string;
  percentileField?: string;
  ratingCategoryField?: string;
  ratingGradeField?: string;
  ratingIdField?: string;
  ratingTypeField?: string;
};

export class BitsightRatingDetailsFieldMapping extends FieldMapping {
  categoryOrderMapping: Record<string, string>;
  companyDetailsMapping: Record<string, string>;
  companyIdMapping: Record<string, string>;
  companyNameMapping: Record<string, string>;
  gradeColorMapping: Record<string, string>;
  percentileMapping: Record<string, string>;
  ratingCategoryMapping: Record<string, string>;
  ratingGradeMapping: Record<string, string>;
  ratingIdMapping: Record<string, string>;
  ratingTypeMapping: Record<string, string>;

  constructor({
    recordHandling,
    sourceMatchField,
    appMatchField,
    messagingRule,
    categoryOrderField = '',
    companyDetailsField = '',
    companyIdField = '',
    companyNameField = '',
    gradeColorField = '',
    percentileField = '',
    ratingCategoryField = '',
    ratingGradeField = '',
    ratingIdField = '',
    ratingTypeField = '',
  }: BitsightRatingDetailsFieldMappingObject) {
    super({ recordHandling, sourceMatchField, appMatchField, messagingRule });
    this.categoryOrderMapping = { 'Category Order': categoryOrderField };
    this.companyDetailsMapping = { 'Company Details': companyDetailsField };
    this.companyIdMapping = { 'Company ID': companyIdField };
    this.companyNameMapping = { 'Company Name': companyNameField };
    this.gradeColorMapping = { 'Grade Color': gradeColorField };
    this.percentileMapping = { Percentile: percentileField };
    this.ratingCategoryMapping = { 'Rating Category': ratingCategoryField };
    this.ratingGradeMapping = { 'Rating Grade': ratingGradeField };
    this.ratingIdMapping = { 'Rating ID': ratingIdField };
    this.ratingTypeMapping = { 'Rating Type': ratingTypeField };
  }
}
