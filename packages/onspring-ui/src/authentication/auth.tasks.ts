import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { LoginPageTargets } from './auth.targets.js';

export const AuthTasks = {
  gotoLogin: (): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().goto(LoginPageTargets.route);
  },

  enterUsername: (username: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().fill(LoginPageTargets.usernameInput, username);
  },

  enterPassword: (password: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().fill(LoginPageTargets.passwordInput, password);
  },

  clickLogin: (): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(LoginPageTargets.loginButton);
  },

  login: (username: string, password: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.attemptsTo(AuthTasks.gotoLogin());
    await actor.attemptsTo(AuthTasks.enterUsername(username));
    await actor.attemptsTo(AuthTasks.enterPassword(password));
    await actor.attemptsTo(AuthTasks.clickLogin());

    // Login may fail intermittently across different browsers
    // when initially inputting correct password (transient clearing).
    const currentUrl = actor.browse().url();
    if (currentUrl.includes(LoginPageTargets.route)) {
      await actor.attemptsTo(AuthTasks.enterPassword(password));
      await actor.attemptsTo(AuthTasks.clickLogin());
    }
  },
};
