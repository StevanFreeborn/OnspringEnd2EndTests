import { Question } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { EditEmailSendingDomainPageTargets } from './emailSendingDomain.targets.js';
import { DnsRecordInfo, EmailSendingDomainDnsRecords } from './emailSendingDomain.types.js';

export const EmailSendingDomainQuestions = {
  dnsRecords:
    (): Question<WebActor, EmailSendingDomainDnsRecords> =>
    async (actor: WebActor): Promise<EmailSendingDomainDnsRecords> => {
      const extractRecord = async (recordType: 'ownership' | 'dkim' | 'returnPath'): Promise<DnsRecordInfo> => {
        const name = await actor.browse().textContent(EditEmailSendingDomainPageTargets.recordCell(recordType, 1));
        const type = await actor.browse().textContent(EditEmailSendingDomainPageTargets.recordCell(recordType, 2));
        const value = await actor.browse().textContent(EditEmailSendingDomainPageTargets.recordCell(recordType, 3));

        if (name === null || type === null || value === null) {
          throw new Error('Failed to extract DNS record information');
        }

        return { name: name.trim(), type: type.trim(), value: value.trim() };
      };

      const ownershipRecord = await extractRecord('ownership');
      const dkimRecord = await extractRecord('dkim');
      const returnPathRecord = await extractRecord('returnPath');

      return { ownershipRecord, dkimRecord, returnPathRecord };
    },
};
