import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly path: string;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.path = '/Public/Login'
    this.usernameInput = page.locator('#UserName');
    this.passwordInput = page.locator('#Password');
    this.loginButton = page.locator('.signin');
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async enterUsername(username: string) {
    await this.usernameInput.click();
    await this.usernameInput.type(username);
  }

  async enterPassword(password: string) {
    await this.passwordInput.click();
    await this.passwordInput.type(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }
}