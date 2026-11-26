import { test as setup } from '@playwright/test';
import { User } from '@stevanfreeborn/onspring-models';
import { AuthTasks, SidebarNavTargets } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { env } from '../env';
import { SYS_ADMIN_AUTH_PATH } from '../playwright.config';

setup('login as system administrator', async ({ page }) => {
  const sysAdminActor = WebActor.using('SysAdmin', page);
  const sysAdminUser = new User({
    firstName: env.SYS_ADMIN_FIRST_NAME,
    lastName: env.SYS_ADMIN_LAST_NAME,
    email: env.SYS_ADMIN_EMAIL,
    username: env.SYS_ADMIN_USERNAME,
    password: env.SYS_ADMIN_PASSWORD,
    status: 'Active',
    sysAdmin: true,
  });

  await setup.step('Login as system administrator', async () => {
    await sysAdminActor.attemptsTo(AuthTasks.login(sysAdminUser.username, sysAdminUser.password));
    await sysAdminActor.browse().check(SidebarNavTargets.usersFullName).hasText(sysAdminUser.fullName);
  });

  await setup.step('Save system administrator auth state', async () => {
    await page.context().storageState({ path: SYS_ADMIN_AUTH_PATH });
    await page.close();
  });
});
