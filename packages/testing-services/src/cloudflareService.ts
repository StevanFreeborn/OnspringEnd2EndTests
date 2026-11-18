export type DnsRecord = {
  name: string;
  type: string;
  value: string;
};

export type DnsRecords = {
  ownershipRecord: DnsRecord;
  dkimRecord: DnsRecord;
  returnPathRecord: DnsRecord;
};

export type AddDnsRecordsResponse = {
  ownershipRecordId: string;
  dkimRecordId: string;
  returnPathRecordId: string;
};

export interface IDnsService {
  addDnsRecordsForCustomDomain(records: DnsRecords): Promise<AddDnsRecordsResponse>;
  deleteDnsRecord(recordId: string): Promise<void>;
}

export class CloudflareService implements IDnsService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(zoneId: string, apiKey: string) {
    this.baseUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}`;
    this.apiKey = apiKey;
  }

  private async sendRequest(endpoint: string, method: string, body?: unknown) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Cloudflare API request failed: ${response.statusText}`);
    }

    if (response.status === 204) {
      return;
    }

    if (response.headers.get('Content-Type') === 'application/json') {
      return response.json();
    }

    return response.text();
  }

  async addDnsRecordsForCustomDomain(records: DnsRecords) {
    const ownershipRequest = this.sendRequest(`/dns_records`, 'POST', {
      name: records.ownershipRecord.name,
      type: records.ownershipRecord.type,
      content: records.ownershipRecord.value,
      proxied: false,
    });

    const dkimRequest = this.sendRequest(`/dns_records`, 'POST', {
      name: records.dkimRecord.name,
      type: records.dkimRecord.type,
      content: records.dkimRecord.value,
      proxied: false,
    });

    const returnPathRequest = this.sendRequest(`/dns_records`, 'POST', {
      name: records.returnPathRecord.name,
      type: records.returnPathRecord.type,
      content: records.returnPathRecord.value,
      proxied: false,
    });

    const [ownershipResponse, dkimResponse, returnPathResponse] = await Promise.all([
      ownershipRequest,
      dkimRequest,
      returnPathRequest,
    ]);

    return {
      ownershipRecordId: ownershipResponse.result.id,
      dkimRecordId: dkimResponse.result.id,
      returnPathRecordId: returnPathResponse.result.id,
    };
  }

  async deleteDnsRecord(recordId: string) {
    await this.sendRequest(`/dns_records/${recordId}`, 'DELETE');
  }
}
