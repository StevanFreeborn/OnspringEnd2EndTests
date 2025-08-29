import { env } from '../../env';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { EditEmailSendingDomainPage } from '../../pageObjectModels/emailSendingDomain/editEmailSendingDomainPage';
import { EmailSendingDomainAdminPage } from '../../pageObjectModels/emailSendingDomain/emailSendingDomainAdminPage';
import { AddDnsRecordsResponse, CloudflareService, IDnsService } from '../../services/cloudflareService';
import { AnnotationType } from '../annotations';
import { Tags } from '../tags';

type EmailSendingDomainTestFixtures = {
  adminHomePage: AdminHomePage;
  editEmailSendingDomainPage: EditEmailSendingDomainPage;
  emailSendingDomainAdminPage: EmailSendingDomainAdminPage;
  dnsService: IDnsService;
};

const test = base.extend<EmailSendingDomainTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => await use(new AdminHomePage(sysAdminPage)),
  editEmailSendingDomainPage: async ({ sysAdminPage }, use) => await use(new EditEmailSendingDomainPage(sysAdminPage)),
  emailSendingDomainAdminPage: async ({ sysAdminPage }, use) =>
    await use(new EmailSendingDomainAdminPage(sysAdminPage)),
  dnsService: async ({}, use) => await use(new CloudflareService(env.CLOUDFLARE_ZONE_ID, env.CLOUDFLARE_API_KEY)),
});

test.describe(
  'email sending domain',
  {
    tag: [Tags.NotFedRAMP],
  },
  () => {
    const emailSendingDomainsToDelete: string[] = [];

    test.beforeEach(({ environment }) => {
      // eslint-disable-next-line playwright/no-skipped-test
      test.skip(environment.isFedspring(), 'This feature is not applicable to the FEDSPRING environment');
    });

    test.afterEach(async ({ emailSendingDomainAdminPage }) => {
      await emailSendingDomainAdminPage.goto();

      for (const emailSendingDomain of emailSendingDomainsToDelete) {
        await emailSendingDomainAdminPage.deleteEmailSendingDomain(emailSendingDomain);
      }
    });

    test('Create an Email Sending Domain via the create button on the header of the admin home page', async ({
      adminHomePage,
      editEmailSendingDomainPage,
    }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-367',
      });

      const emailSendingDomain = FakeDataFactory.createFakeCustomEmailSendingDomain();
      emailSendingDomainsToDelete.push(emailSendingDomain);

      await test.step('Navigate to the admin home page', async () => {
        await adminHomePage.goto();
      });

      await test.step('Create an email sending domain', async () => {
        await adminHomePage.createEmailSendingDomainUsingHeaderCreateButton(emailSendingDomain);
        await adminHomePage.page.waitForURL(editEmailSendingDomainPage.pathRegex);
      });

      await test.step('Verify the email sending domain was created', async () => {
        await expect(editEmailSendingDomainPage.name()).toHaveText(emailSendingDomain);
      });
    });

    test('Create an Email Sending Domain via the create button on the Instance tile on the admin home page', async ({
      adminHomePage,
      editEmailSendingDomainPage,
    }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-368',
      });

      const emailSendingDomain = FakeDataFactory.createFakeCustomEmailSendingDomain();
      emailSendingDomainsToDelete.push(emailSendingDomain);

      await test.step('Navigate to the admin home page', async () => {
        await adminHomePage.goto();
      });

      await test.step('Create an email sending domain', async () => {
        await adminHomePage.createEmailSendingDomainUsingInstanceTileCreateButton(emailSendingDomain);
        await adminHomePage.page.waitForURL(editEmailSendingDomainPage.pathRegex);
      });

      await test.step('Verify the email sending domain was created', async () => {
        await expect(editEmailSendingDomainPage.name()).toHaveText(emailSendingDomain);
      });
    });

    test('Create an Email Sending Domain via the "Create Email Sending Domain" button on the email sending domain home page', async ({
      emailSendingDomainAdminPage,
      editEmailSendingDomainPage,
    }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-369',
      });

      const emailSendingDomain = FakeDataFactory.createFakeCustomEmailSendingDomain();
      emailSendingDomainsToDelete.push(emailSendingDomain);

      await test.step('Navigate to the email sending domain home page', async () => {
        await emailSendingDomainAdminPage.goto();
      });

      await test.step('Create an email sending domain', async () => {
        await emailSendingDomainAdminPage.createEmailSendingDomain(emailSendingDomain);
      });

      await test.step('Verify the email sending domain was created', async () => {
        await expect(editEmailSendingDomainPage.name()).toHaveText(emailSendingDomain);
      });
    });

    test('Setup an verify an email sending domain', async ({
      emailSendingDomainAdminPage,
      editEmailSendingDomainPage,
      dnsService,
    }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-370',
      });

      test.slow();

      let dnsRecordIds: AddDnsRecordsResponse | null = null;
      const emailSendingDomain = FakeDataFactory.createFakeCustomEmailSendingDomain();
      emailSendingDomainsToDelete.push(emailSendingDomain);

      await test.step('Navigate to the email sending domain admin page', async () => {
        await emailSendingDomainAdminPage.goto();
      });

      await test.step('Create an email sending domain', async () => {
        await emailSendingDomainAdminPage.createEmailSendingDomain(emailSendingDomain);
        await emailSendingDomainAdminPage.page.waitForURL(editEmailSendingDomainPage.pathRegex);
      });

      await test.step('Create DNS records for the email sending domain', async () => {
        const dnsRecords = await editEmailSendingDomainPage.dnsRecords();
        dnsRecordIds = await dnsService.addDnsRecordsForCustomDomain(dnsRecords);
        expect(dnsRecordIds).not.toBeNull();
      });

      await test.step('Wait for 30 seconds before making first verification attempts', async () => {
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await editEmailSendingDomainPage.page.waitForTimeout(30_000);
      });

      await test.step('Verify the ownership record', async () => {
        await expect(async () => {
          const result = await editEmailSendingDomainPage.verifyOwnershipRecord();
          expect(result).toBe(true);
        }).toPass({
          intervals: [30_000],
        });
      });

      await test.step('Verify the DKIM record', async () => {
        await expect(async () => {
          const result = await editEmailSendingDomainPage.verifyDkimRecord();
          expect(result).toBe(true);
        }).toPass({
          intervals: [30_000],
        });
      });

      await test.step('Verify the Return Path record', async () => {
        await expect(async () => {
          const result = await editEmailSendingDomainPage.verifyReturnPathRecord();
          expect(result).toBe(true);
        }).toPass({
          intervals: [30_000],
        });
      });

      await test.step('Delete the DNS records created', async () => {
        for (const id of Object.values(dnsRecordIds!)) {
          await dnsService.deleteDnsRecord(id);
        }
      });
    });

    test('Delete a custom email sending domain', async ({
      emailSendingDomainAdminPage,
      editEmailSendingDomainPage,
    }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-371',
      });

      const emailSendingDomain = FakeDataFactory.createFakeCustomEmailSendingDomain();

      await test.step('Navigate to the email sending domain admin page', async () => {
        await emailSendingDomainAdminPage.goto();
      });

      await test.step('Create an email sending domain to delete', async () => {
        await emailSendingDomainAdminPage.createEmailSendingDomain(emailSendingDomain);
        await emailSendingDomainAdminPage.page.waitForURL(editEmailSendingDomainPage.pathRegex);
      });

      await test.step('Navigate back to the email sending domain admin page', async () => {
        await emailSendingDomainAdminPage.goto();
      });

      await test.step('Delete the email sending domain', async () => {
        await emailSendingDomainAdminPage.deleteEmailSendingDomain(emailSendingDomain);
      });

      await test.step('Verify the email sending domain was deleted', async () => {
        const row = await emailSendingDomainAdminPage.getEmailSendingDomainRowByName(emailSendingDomain);
        await expect(row).toBeHidden();
      });
    });
  }
);
