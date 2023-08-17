import { Locator, Page } from '@playwright/test';
import { User } from '../models/user';

export class LoginPage {
  static readonly invalidCredentialError = {
    text: 'Username/Password combination is not valid',
    color: 'rgb(204, 0, 0)',
    fontWeight: '700',
  };

  readonly page: Page;
  readonly path: string;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly validationErrors: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/Public/Login';
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.locator('text=Login');
    this.validationErrors = page.locator('.validation-summary-errors');
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async enterUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async login(user: User) {
    await this.goto();
    await this.enterUsername(user.username);
    await this.enterPassword(user.password);
    await this.clickLoginButton();
  }
}
