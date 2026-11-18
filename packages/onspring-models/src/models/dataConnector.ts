export type DataConnectorType =
  | 'Ascent Data Connector'
  | 'BitSight Data Connector'
  | 'Black Kite Data Connector'
  | 'Jira Data Connector'
  | 'RapidRatings Data Connector'
  | 'Regology Data Connector'
  | 'Risk Recon Data Connector'
  | 'Secure File Data Connector'
  | 'Security Scorecard Data Connector'
  | 'Slack App Connector'
  | 'Unified Compliance Framework (UCF) Connector';

export type DataConnectorFrequency = 'Every Day' | 'Every Weekday' | 'Every Week' | 'Every Month';

export type DataConnectorObject = {
  name: string;
  description?: string;
  status?: boolean;
  type: DataConnectorType;
};

export abstract class DataConnector {
  name: string;
  description: string;
  status: boolean;
  readonly type: DataConnectorType;

  constructor({ name, description = '', status = false, type }: DataConnectorObject) {
    this.name = name;
    this.description = description;
    this.status = status;
    this.type = type;
  }
}
