import { Page } from '@playwright/test';
import { FakeDataFactory } from '@stevanfreeborn/onspring-models';
import { AuthTasks, DashboardTargets, LoginPageTargets } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { test as baseTest } from '../../fixtures';
import { errorResponseHandler } from '../../fixtures/auth.fixtures';

type LoginTestFixtures = {
  page: Page;
  userActor: WebActor;
};

const test = baseTest.extend<LoginTestFixtures>({
  page: async ({ page }, use) => {
    page.on('response', errorResponseHandler);
    await use(page);
  },
  userActor: async ({ page }, use) => {
    const actor = WebActor.using('User', page);
    await use(actor);
  },
});

test.describe('login', () => {
  test('user can login using valid username and password.', async ({ userActor, sysAdminUser }) => {
    await test.step('Navigate to login page.', async () => {
      await userActor.attemptsTo(AuthTasks.gotoLogin());
    });

    await test.step('Enter username and password.', async () => {
      await userActor.attemptsTo(AuthTasks.enterUsername(sysAdminUser.username));
      await userActor.attemptsTo(AuthTasks.enterPassword(sysAdminUser.password));
    });

    await test.step('Click login button.', async () => {
      await userActor.attemptsTo(AuthTasks.clickLogin());

      // Login may fail intermittently across different browsers
      // when initially inputting correct password (transient clearing).
      const currentUrl = userActor.browse().url();
      // eslint-disable-next-line playwright/no-conditional-in-test
      if (currentUrl.includes(LoginPageTargets.route)) {
        await userActor.attemptsTo(AuthTasks.enterPassword(sysAdminUser.password));
        await userActor.attemptsTo(AuthTasks.clickLogin());
      }
    });

    await test.step('Verify user is logged in.', async () => {
      await userActor.browse().checkPage().hasUrl(DashboardTargets.pathRegex);
      await userActor.browse().check(DashboardTargets.usersFullName).hasText(sysAdminUser.fullName);
    });
  });

  test('user cannot login using invalid username.', async ({ userActor, sysAdminUser }) => {
    const fakeUsername = FakeDataFactory.createFakeUsername();

    await test.step('Navigate to login page.', async () => {
      await userActor.attemptsTo(AuthTasks.gotoLogin());
    });

    await test.step('Enter username and password.', async () => {
      await userActor.attemptsTo(AuthTasks.enterUsername(fakeUsername));
      await userActor.attemptsTo(AuthTasks.enterPassword(sysAdminUser.password));
    });

    await test.step('Click login button.', async () => {
      await userActor.attemptsTo(AuthTasks.clickLogin());
    });

    await test.step('Verify user is not logged in.', async () => {
      await userActor.browse().checkPage().hasUrl(LoginPageTargets.pathRegex);
      await userActor
        .browse()
        .check(LoginPageTargets.validationErrors)
        .hasText(LoginPageTargets.invalidCredentialErrorMessage);
      await userActor
        .browse()
        .check(LoginPageTargets.validationErrors)
        .hasCSS('color', LoginPageTargets.invalidCredentialErrorColor);
      await userActor
        .browse()
        .check(LoginPageTargets.validationErrors)
        .hasCSS('font-weight', LoginPageTargets.invalidCredentialErrorFontWeight);
    });
  });

  test('user cannot login using invalid password.', async ({ userActor, sysAdminUser }) => {
    const fakePassword = FakeDataFactory.createFakePassword();

    await test.step('Navigate to login page.', async () => {
      await userActor.attemptsTo(AuthTasks.gotoLogin());
    });

    await test.step('Enter username and password.', async () => {
      await userActor.attemptsTo(AuthTasks.enterUsername(sysAdminUser.username));
      await userActor.attemptsTo(AuthTasks.enterPassword(fakePassword));
    });

    await test.step('Click login button.', async () => {
      await userActor.attemptsTo(AuthTasks.clickLogin());
    });

    await test.step('Verify user is not logged in.', async () => {
      await userActor.browse().checkPage().hasUrl(LoginPageTargets.pathRegex);
      await userActor
        .browse()
        .check(LoginPageTargets.validationErrors)
        .hasText(LoginPageTargets.invalidCredentialErrorMessage);
      await userActor
        .browse()
        .check(LoginPageTargets.validationErrors)
        .hasCSS('color', LoginPageTargets.invalidCredentialErrorColor);
      await userActor
        .browse()
        .check(LoginPageTargets.validationErrors)
        .hasCSS('font-weight', LoginPageTargets.invalidCredentialErrorFontWeight);
    });
  });

  test('user cannot login using invalid username and password.', async ({ userActor }) => {
    const fakeUsername = FakeDataFactory.createFakeUsername();
    const fakePassword = FakeDataFactory.createFakePassword();

    await test.step('Navigate to login page.', async () => {
      await userActor.attemptsTo(AuthTasks.gotoLogin());
    });

    await test.step('Enter username and password.', async () => {
      await userActor.attemptsTo(AuthTasks.enterUsername(fakeUsername));
      await userActor.attemptsTo(AuthTasks.enterPassword(fakePassword));
    });

    await test.step('Click login button.', async () => {
      await userActor.attemptsTo(AuthTasks.clickLogin());
    });

    await test.step('Verify user is not logged in.', async () => {
      await userActor.browse().checkPage().hasUrl(LoginPageTargets.pathRegex);
      await userActor
        .browse()
        .check(LoginPageTargets.validationErrors)
        .hasText(LoginPageTargets.invalidCredentialErrorMessage);
      await userActor
        .browse()
        .check(LoginPageTargets.validationErrors)
        .hasCSS('color', LoginPageTargets.invalidCredentialErrorColor);
      await userActor
        .browse()
        .check(LoginPageTargets.validationErrors)
        .hasCSS('font-weight', LoginPageTargets.invalidCredentialErrorFontWeight);
    });
  });
});
