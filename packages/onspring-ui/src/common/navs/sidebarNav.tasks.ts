import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { LoginPageTargets } from '../../authentication/auth.targets.js';
import { SidebarNavTargets, UserPreferencesModalTargets } from './adminNav.targets.js';

export const SidebarNavTasks = {
  setDefaultDashboard:
    (dashboardName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(SidebarNavTargets.userImage);
      await actor.browse().waitForState(SidebarNavTargets.userMenu, 'visible');
      await actor.browse().click(SidebarNavTargets.preferencesLink);
      await actor.browse().waitForState(UserPreferencesModalTargets.modal, 'visible');

      const isPlaceholderVisible = await actor
        .browse()
        .isVisible(UserPreferencesModalTargets.defaultDashboardPlaceholder);

      if (isPlaceholderVisible) {
        throw new Error('Default dashboard is not configurable');
      }

      await actor.browse().click(UserPreferencesModalTargets.defaultDashboardMethodSelector);
      await actor.browse().click(UserPreferencesModalTargets.optionByName('Selected Dashboard'));

      await actor.browse().click(UserPreferencesModalTargets.defaultDashboardSelector);
      await actor.browse().click(UserPreferencesModalTargets.optionByName(dashboardName));

      await actor.browse().click(UserPreferencesModalTargets.saveButton);
      await actor.browse().waitForState(UserPreferencesModalTargets.modal, 'hidden');
    },

  logout:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(SidebarNavTargets.userImage);
      await actor.browse().waitForState(SidebarNavTargets.userMenu, 'visible');
      const navPromise = actor.browse().waitForUrl(LoginPageTargets.pathRegex);
      await actor.browse().click(SidebarNavTargets.logoutLink);
      await navPromise;
    },
};
