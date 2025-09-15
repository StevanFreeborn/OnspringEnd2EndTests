import { test as base, BrowserContext, expect, FrameLocator, Locator } from '../../fixtures';
import { DashboardPage } from '../../pageObjectModels/dashboards/dashboardPage';
import { AnnotationType } from '../annotations';

type GettingStartedDashboardTestFixtures = {
  dashboardPage: DashboardPage;
};

const test = base.extend<GettingStartedDashboardTestFixtures>({
  dashboardPage: async ({ sysAdminPage }, use) => await use(new DashboardPage(sysAdminPage)),
});

test.describe('getting started dashboard', () => {
  test('Verify that all links on the Welcome to Onspring dashboard work properly', async ({ dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-789',
    });

    const context = dashboardPage.page.context();
    let frame: FrameLocator;

    await test.step('Navigate to the Getting Started Dashboard', async () => {
      await dashboardPage.goto();
      await dashboardPage.sidebar.dashboardsTab.click();
      await dashboardPage.sidebar.getContainerLink('Getting Started').click();
      await expect(dashboardPage.dashboardBreadcrumbTitle).toHaveText('Welcome to Onspring');
      frame = dashboardPage.page.frameLocator('iframe');
    });

    await test.step('Verify that Onspring Help Center link works', async () => {
      const linkLocator = frame.getByRole('link', { name: 'Onspring Help Center' });
      await checkLinkOpensExpectedPage(context, linkLocator, /Help\/Content\/Home/);
    });

    await test.step('Verify that Admin Guidance link works', async () => {
      const linkLocator = frame.getByRole('link', { name: 'Admin Guidance' });
      await checkLinkOpensExpectedPage(context, linkLocator, /Help\/Content\/Administrators\/OnspringAdministrators/);
    });

    await test.step('Verify that End User Guidance link works', async () => {
      const linkLocator = frame.getByRole('link', { name: 'End User Guidance' });
      await checkLinkOpensExpectedPage(context, linkLocator, /Help\/Content\/EndUsers\/OnspringEndUsers/);
    });

    await test.step('Verify that Onspring Community link works', async () => {
      const linkLocator = frame.getByRole('link', { name: 'Onspring Community' });
      await checkLinkOpensExpectedPage(context, linkLocator, /Help\/Content\/GettingStarted\/OnspringCommunity/);
    });

    await test.step('Verify that FAQs link works', async () => {
      const linkLocator = frame.getByRole('link', { name: 'FAQs' });
      await checkLinkOpensExpectedPage(context, linkLocator, /Help\/Content\/FAQs\/AdministratorFAQs/);
    });

    await test.step('Verify that Navigating Onspring link works', async () => {
      const linkLocator = frame.locator('.quick-videos').getByRole('link').nth(0);
      await checkLinkOpensExpectedPage(
        context,
        linkLocator,
        /6101136457001\/ovTsIlEHZ_default\/index.html\?videoId=6208796889001/
      );
    });

    await test.step('Verify that Exploring the Admin Panel link works', async () => {
      const linkLocator = frame.locator('.quick-videos').getByRole('link').nth(1);
      await checkLinkOpensExpectedPage(
        context,
        linkLocator,
        /6101136457001\/ovTsIlEHZ_default\/index.html\?videoId=6297946611001/
      );
    });

    await test.step('Verify that Managing Your User Profile link works', async () => {
      const linkLocator = frame.locator('.quick-videos').getByRole('link').nth(2);
      await checkLinkOpensExpectedPage(
        context,
        linkLocator,
        /6101136457001\/ovTsIlEHZ_default\/index.html\?videoId=6255674161001/
      );
    });

    await test.step('Verify that Release Notes link works', async () => {
      const linkLocator = frame.getByRole('link', { name: 'Release Notes' });
      await checkLinkOpensExpectedPage(context, linkLocator, /Help\/Content\/ReleaseNotes\/ReleaseNotes/);
    });

    await test.step('Verify that Classroom Training link works', async () => {
      const linkLocator = frame.getByRole('link', { name: 'Classroom Training' });
      await checkLinkOpensExpectedPage(context, linkLocator, /\/for-clients\/training/);
    });

    await test.step('Verify that Video Gallery link works', async () => {
      const linkLocator = frame.getByRole('link', { name: 'Video Gallery' });
      await checkLinkOpensExpectedPage(context, linkLocator, /Help\/Content\/Videos\/OnspringVideos/);
    });

    await test.step('Verify that Event Calendar link works', async () => {
      const linkLocator = frame.getByRole('link', { name: 'Event Calendar' });
      await checkLinkOpensExpectedPage(context, linkLocator, /\/resources\/events-webinars/);
    });

    await test.step('Verify that YouTube Channel link works', async () => {
      const linkLocator = frame.getByRole('link', { name: 'Youtube' });
      await checkLinkOpensExpectedPage(context, linkLocator, /\/channel\/UCsfhhDvZB-YxJ7HqQvb-ohA/);
    });

    await test.step('Verify that Twitter link works', async () => {
      const linkLocator = frame.getByRole('link', { name: 'Twitter' });
      await checkLinkOpensExpectedPage(context, linkLocator, /x.com\/onspring/);
    });

    await test.step('Verify that LinkedIn link works', async () => {
      const linkLocator = frame.getByRole('link', { name: 'LinkedIn' });
      await checkLinkOpensExpectedPage(context, linkLocator, /linkedin\.com/);
    });

    await test.step('Verify that Facebook link works', async () => {
      const linkLocator = frame.getByRole('link', { name: 'Facebook' });
      await checkLinkOpensExpectedPage(context, linkLocator, /facebook\.com\/OnspringTechnologies/);
    });
  });
});

async function checkLinkOpensExpectedPage(context: BrowserContext, linkLocator: Locator, urlRegex: RegExp) {
  const pagePromise = context.waitForEvent('page');
  await linkLocator.click();
  const newPage = await pagePromise;
  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL(urlRegex);
  await newPage.close();
}
