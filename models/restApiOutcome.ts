import { Outcome, OutcomeObject } from './outcome';

type HttpMethod = 'GET' | 'PATCH' | 'POST' | 'PUT' | 'DELETE';

type AuthorizationType = 'API Key' | 'No Authorization Required';

type RestApiOutcomeObject = Omit<OutcomeObject, 'type'> & {
  method?: HttpMethod;
  restURL: string;
  authorization?: AuthorizationType;
  notificationGroups?: string[];
  notificationUsers?: string[];
  dataMappings?: Record<string, string>;
};

export class RestApiOutcome extends Outcome {
  method: HttpMethod;
  restURL: string;
  authorization: AuthorizationType;
  notificationUsers: string[];
  notificationGroups: string[];
  dataMappings: Record<string, string>;

  constructor({
    status,
    description,
    method = 'GET',
    restURL,
    authorization = 'API Key',
    notificationUsers = [],
    notificationGroups = [],
    dataMappings = {},
  }: RestApiOutcomeObject) {
    super({ type: 'REST API', status, description });
    this.method = method;
    this.restURL = restURL;
    this.authorization = authorization;
    this.notificationUsers = notificationUsers;
    this.notificationGroups = notificationGroups;
    this.dataMappings = dataMappings;

    if (this.notificationUsers.length === 0 && this.notificationGroups.length === 0) {
      throw new Error('At least one notification user or group is required');
    }
  }
}
