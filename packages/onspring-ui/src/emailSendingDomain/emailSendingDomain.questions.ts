import { Question } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DnsRecordInfo, EmailSendingDomainDnsRecords } from './emailSendingDomain.types.js';
import { EditEmailSendingDomainPageTargets } from './emailSendingDomain.targets.js';

export const EmailSendingDomainQuestions = {
  dnsRecords:
    (): Question<WebActor, EmailSendingDomainDnsRecords> =>
    async (actor: WebActor): Promise<EmailSendingDomainDnsRecords> => {
      const extractRecord = async (rowTarget: Target): Promise<DnsRecordInfo> => {
        const row = actor.browse().locator(rowTarget);
        const name = await row.locator('td').nth(1).textContent();
        const type = await row.locator('td').nth(2).textContent();
        const value = await row.locator('td').nth(3).textContent();

        if (name === null || type === null || value === null) {
          throw new Error('Failed to extract DNS record information');
        }

        return { name: name.trim(), type: type.trim(), value: value.trim() };
      };

      const ownershipRecord = await extractRecord(EditEmailSendingDomainPageTargets.ownershipRow);
      const dkimRecord = await extractRecord(EditEmailSendingDomainPageTargets.dkimRow);
      const returnPathRecord = await extractRecord(EditEmailSendingDomainPageTargets.returnPathRow);

      return { ownershipRecord, dkimRecord, returnPathRecord };
    },
};
