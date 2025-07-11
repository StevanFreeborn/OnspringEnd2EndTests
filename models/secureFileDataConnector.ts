import { DataConnector, DataConnectorObject } from "./dataConnector";

type SecureFileDataConnectorObject = Omit<DataConnectorObject, 'type'> & {};

export class SecureFileDataConnector extends DataConnector {
  constructor({
    name,
    description,
    status,
  }: SecureFileDataConnectorObject) {
    super({ name, description, status, type: 'Secure File Data Connector' });
  }
}
