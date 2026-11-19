import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';

export interface SetAriaSwitchOptions {
  switchTarget: Target;
  toggleTarget: Target;
  enabled: boolean;
}

export interface SetKendoSwitchOptions {
  switchTarget: Target;
  enabled: boolean;
}

export const StatusSwitchTasks = {
  setAriaSwitch:
    ({ switchTarget, toggleTarget, enabled }: SetAriaSwitchOptions): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const currentChecked = (await actor.browse().getAttribute(switchTarget, 'aria-checked')) === 'true';

      if (currentChecked !== enabled) {
        await actor.browse().click(toggleTarget);
      }
    },

  setKendoSwitch:
    ({ switchTarget, enabled }: SetKendoSwitchOptions): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const switchClass = (await actor.browse().getAttribute(switchTarget, 'class')) ?? '';
      const isCurrentlyOn = switchClass.includes('k-switch-on');

      if (isCurrentlyOn !== enabled) {
        await actor.browse().click(switchTarget);
      }
    },
};
