import {
  DashboardPageTargets,
  DashboardTasks,
  GettingStartedDashboardTargets,
  SidebarNavTasks,
} from '@stevanfreeborn/onspring-ui';
import { test } from '../../fixtures';
import { AnnotationType } from '../annotations';

test.describe('getting started dashboard', () => {
  test('Verify that all links on the Welcome to Onspring dashboard work properly', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-789',
    });

    await test.step('Navigate to the Getting Started Dashboard', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.gotoDashboard(),
        SidebarNavTasks.openDashboardContainer('Getting Started')
      );
      await sysAdminActor.browse().check(DashboardPageTargets.breadcrumbTitle).hasText('Welcome to Onspring');
    });

    await test.step('Verify that Onspring Help Center link works', async () => {
      await sysAdminActor
        .browse()
        .check(GettingStartedDashboardTargets.linkByName('Onspring Help Center'))
        .opensNewTabWithUrl(/Help\/Content\/Home/);
    });

    await test.step('Verify that Admin Guidance link works', async () => {
      await sysAdminActor
        .browse()
        .check(GettingStartedDashboardTargets.linkByName('Admin Guidance'))
        .opensNewTabWithUrl(/Help\/Content\/Administrators\/OnspringAdministrators/);
    });

    await test.step('Verify that End User Guidance link works', async () => {
      await sysAdminActor
        .browse()
        .check(GettingStartedDashboardTargets.linkByName('End User Guidance'))
        .opensNewTabWithUrl(/Help\/Content\/EndUsers\/OnspringEndUsers/);
    });

    await test.step('Verify that Onspring Community link works', async () => {
      await sysAdminActor
        .browse()
        .check(GettingStartedDashboardTargets.linkByName('Onspring Community'))
        .opensNewTabWithUrl(/Help\/Content\/GettingStarted\/OnspringCommunity/);
    });

    await test.step('Verify that FAQs link works', async () => {
      await sysAdminActor
        .browse()
        .check(GettingStartedDashboardTargets.linkByName('FAQs'))
        .opensNewTabWithUrl(/Help\/Content\/FAQs\/AdministratorFAQs/);
    });

    await test.step('Verify that Navigating Onspring link works', async () => {
      await sysAdminActor
        .browse()
        .check(GettingStartedDashboardTargets.quickVideoLink(0))
        .opensNewTabWithUrl(/6101136457001\/ovTsIlEHZ_default\/index.html\?videoId=6208796889001/);
    });

    await test.step('Verify that Exploring the Admin Panel link works', async () => {
      await sysAdminActor
        .browse()
        .check(GettingStartedDashboardTargets.quickVideoLink(1))
        .opensNewTabWithUrl(/6101136457001\/ovTsIlEHZ_default\/index.html\?videoId=6297946611001/);
    });

    await test.step('Verify that Managing Your User Profile link works', async () => {
      await sysAdminActor
        .browse()
        .check(GettingStartedDashboardTargets.quickVideoLink(2))
        .opensNewTabWithUrl(/6101136457001\/ovTsIlEHZ_default\/index.html\?videoId=6255674161001/);
    });

    await test.step('Verify that Release Notes link works', async () => {
      await sysAdminActor
        .browse()
        .check(GettingStartedDashboardTargets.linkByName('Release Notes'))
        .opensNewTabWithUrl(/Help\/Content\/ReleaseNotes\/ReleaseNotes/);
    });

    await test.step('Verify that Classroom Training link works', async () => {
      await sysAdminActor
        .browse()
        .check(GettingStartedDashboardTargets.linkByName('Classroom Training'))
        .opensNewTabWithUrl(/\/for-clients\/training/);
    });

    await test.step('Verify that Video Gallery link works', async () => {
      await sysAdminActor
        .browse()
        .check(GettingStartedDashboardTargets.linkByName('Video Gallery'))
        .opensNewTabWithUrl(/Help\/Content\/Videos\/OnspringVideos/);
    });

    await test.step('Verify that Event Calendar link works', async () => {
      await sysAdminActor
        .browse()
        .check(GettingStartedDashboardTargets.linkByName('Event Calendar'))
        .opensNewTabWithUrl(/\/resources\/events-webinars/);
    });

    await test.step('Verify that YouTube Channel link works', async () => {
      await sysAdminActor
        .browse()
        .check(GettingStartedDashboardTargets.linkByName('Youtube'))
        .opensNewTabWithUrl(/\/channel\/UCsfhhDvZB-YxJ7HqQvb-ohA/);
    });

    await test.step('Verify that Twitter link works', async () => {
      await sysAdminActor
        .browse()
        .check(GettingStartedDashboardTargets.linkByName('Twitter'))
        .opensNewTabWithUrl(/x.com\/onspring/);
    });

    await test.step('Verify that LinkedIn link works', async () => {
      await sysAdminActor
        .browse()
        .check(GettingStartedDashboardTargets.linkByName('LinkedIn'))
        .opensNewTabWithUrl(/linkedin\.com/);
    });

    await test.step('Verify that Facebook link works', async () => {
      await sysAdminActor
        .browse()
        .check(GettingStartedDashboardTargets.linkByName('Facebook'))
        .opensNewTabWithUrl(/facebook\.com\/OnspringTechnologies/);
    });
  });
});
