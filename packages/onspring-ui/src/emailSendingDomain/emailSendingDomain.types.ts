export type DnsRecordInfo = {
  name: string;
  type: string;
  value: string;
};

export type EmailSendingDomainDnsRecords = {
  ownershipRecord: DnsRecordInfo;
  dkimRecord: DnsRecordInfo;
  returnPathRecord: DnsRecordInfo;
};
