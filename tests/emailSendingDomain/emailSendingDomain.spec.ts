import {
  EditEmailSendingDomainPageTargets,
  EmailSendingDomainPageTargets,
  EmailSendingDomainQuestions,
  EmailSendingDomainTasks,
} from '@stevanfreeborn/onspring-ui';
import { Retry } from '@stevanfreeborn/screenplay-playwright';
import { env } from '../../env';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AddDnsRecordsResponse, CloudflareService, IDnsService } from '../../services/cloudflareService';
import { AnnotationType } from '../annotations';
import { Tags } from '../tags';

type EmailSendingDomainTestFixtures = {
  dnsService: IDnsService;
};

const test = base.extend<EmailSendingDomainTestFixtures>({
  dnsService: async ({}, use) => await use(new CloudflareService(env.CLOUDFLARE_ZONE_ID!, env.CLOUDFLARE_API_KEY!)),
});

test.describe(
  'email sending domain',
  {
    tag: [Tags.NotFedRAMP],
  },
  () => {
    let emailSendingDomainsToDelete: string[] = [];

    test.beforeEach(({ environment }) => {
      // eslint-disable-next-line playwright/no-skipped-test
      test.skip(environment.isFedspring(), 'This feature is not applicable to the FEDSPRING environment');
    });

    test.afterEach(async ({ sysAdminActor }) => {
      await sysAdminActor.attemptsTo(
        EmailSendingDomainTasks.goto(),
        EmailSendingDomainTasks.deleteEmailSendingDomains(emailSendingDomainsToDelete)
      );
      emailSendingDomainsToDelete = [];
    });

    test('Create an Email Sending Domain via the create button on the header of the admin home page', async ({
      sysAdminActor,
    }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-367',
      });

      const emailSendingDomain = FakeDataFactory.createFakeCustomEmailSendingDomain();
      emailSendingDomainsToDelete.push(emailSendingDomain);

      await test.step('Navigate to the admin home page', async () => {
        await sysAdminActor.browse().goto('/Admin/Home');
      });

      await test.step('Create an email sending domain', async () => {
        await sysAdminActor.attemptsTo(EmailSendingDomainTasks.createViaHeader(emailSendingDomain));
        await sysAdminActor.browse().checkPage().hasUrl(EditEmailSendingDomainPageTargets.pathRegex);
      });

      await test.step('Verify the email sending domain was created', async () => {
        await sysAdminActor
          .browse()
          .check(EditEmailSendingDomainPageTargets.domainName)
          .hasText(emailSendingDomain);
      });
    });

    test('Create an Email Sending Domain via the create button on the Instance tile on the admin home page', async ({
      sysAdminActor,
    }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-368',
      });

      const emailSendingDomain = FakeDataFactory.createFakeCustomEmailSendingDomain();
      emailSendingDomainsToDelete.push(emailSendingDomain);

      await test.step('Navigate to the admin home page', async () => {
        await sysAdminActor.browse().goto('/Admin/Home');
      });

      await test.step('Create an email sending domain', async () => {
        await sysAdminActor.attemptsTo(EmailSendingDomainTasks.createViaTile(emailSendingDomain));
        await sysAdminActor.browse().checkPage().hasUrl(EditEmailSendingDomainPageTargets.pathRegex);
      });

      await test.step('Verify the email sending domain was created', async () => {
        await sysAdminActor
          .browse()
          .check(EditEmailSendingDomainPageTargets.domainName)
          .hasText(emailSendingDomain);
      });
    });

    test('Create an Email Sending Domain via the "Create Email Sending Domain" button on the email sending domain home page', async ({
      sysAdminActor,
    }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-369',
      });

      const emailSendingDomain = FakeDataFactory.createFakeCustomEmailSendingDomain();
      emailSendingDomainsToDelete.push(emailSendingDomain);

      await test.step('Navigate to the email sending domain home page', async () => {
        await sysAdminActor.attemptsTo(EmailSendingDomainTasks.goto());
      });

      await test.step('Create an email sending domain', async () => {
        await sysAdminActor.attemptsTo(EmailSendingDomainTasks.create(emailSendingDomain));
      });

      await test.step('Verify the email sending domain was created', async () => {
        await sysAdminActor
          .browse()
          .check(EditEmailSendingDomainPageTargets.domainName)
          .hasText(emailSendingDomain);
      });
    });

    test('Setup an verify an email sending domain', async ({ sysAdminActor, dnsService }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-370',
      });

      test.slow();

      let dnsRecordIds: AddDnsRecordsResponse | null = null;
      const emailSendingDomain = FakeDataFactory.createFakeCustomEmailSendingDomain();
      emailSendingDomainsToDelete.push(emailSendingDomain);

      await test.step('Navigate to the email sending domain admin page', async () => {
        await sysAdminActor.attemptsTo(EmailSendingDomainTasks.goto());
      });

      await test.step('Create an email sending domain', async () => {
        await sysAdminActor.attemptsTo(EmailSendingDomainTasks.create(emailSendingDomain));
        await sysAdminActor.browse().checkPage().hasUrl(EditEmailSendingDomainPageTargets.pathRegex);
      });

      await test.step('Create DNS records for the email sending domain', async () => {
        const dnsRecords = await sysAdminActor.asks(EmailSendingDomainQuestions.dnsRecords());
        dnsRecordIds = await dnsService.addDnsRecordsForCustomDomain(dnsRecords);
        expect(dnsRecordIds).not.toBeNull();
      });

      await test.step('Wait for 30 seconds before making first verification attempts', async () => {
        await sysAdminActor.browse().waitForTimeout(30_000);
      });

      await test.step('Verify the ownership record', async () => {
        await sysAdminActor.attemptsTo(
          Retry.until(EmailSendingDomainTasks.verifyRecord('ownership'), {
            intervals: [30_000],
          })
        );
      });

      await test.step('Verify the DKIM record', async () => {
        await sysAdminActor.attemptsTo(
          Retry.until(EmailSendingDomainTasks.verifyRecord('dkim'), {
            intervals: [30_000],
          })
        );
      });

      await test.step('Verify the Return Path record', async () => {
        await sysAdminActor.attemptsTo(
          Retry.until(EmailSendingDomainTasks.verifyRecord('returnPath'), {
            intervals: [30_000],
          })
        );
      });

      await test.step('Delete the DNS records created', async () => {
        for (const id of Object.values(dnsRecordIds!)) {
          await dnsService.deleteDnsRecord(id);
        }
      });
    });

    test('Delete a custom email sending domain', async ({ sysAdminActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-371',
      });

      const emailSendingDomain = FakeDataFactory.createFakeCustomEmailSendingDomain();

      await test.step('Navigate to the email sending domain admin page', async () => {
        await sysAdminActor.attemptsTo(EmailSendingDomainTasks.goto());
      });

      await test.step('Create an email sending domain to delete', async () => {
        await sysAdminActor.attemptsTo(EmailSendingDomainTasks.create(emailSendingDomain));
        await sysAdminActor.browse().checkPage().hasUrl(EditEmailSendingDomainPageTargets.pathRegex);
      });

      await test.step('Navigate back to the email sending domain admin page', async () => {
        await sysAdminActor.attemptsTo(EmailSendingDomainTasks.goto());
      });

      await test.step('Delete the email sending domain', async () => {
        await sysAdminActor.attemptsTo(EmailSendingDomainTasks.deleteEmailSendingDomain(emailSendingDomain));
      });

      await test.step('Verify the email sending domain was deleted', async () => {
        await sysAdminActor
          .browse()
          .check(EmailSendingDomainPageTargets.rowByName(emailSendingDomain))
          .isNotAttached();
      });
    });
  }
);
