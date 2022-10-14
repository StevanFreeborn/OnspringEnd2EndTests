import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('');
    this.passwordInput = page.locator('');
    this.loginButton = page.locator('');
  }

  async goto() {
    await this.page.goto('/Public/Login');
  }
}