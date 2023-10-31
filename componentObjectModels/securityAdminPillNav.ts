import { Locator, Page } from "@playwright/test";

export class SecurityAdminPillNav {
  readonly usersPillButton: Locator;
  readonly rolesPillButton: Locator;
  readonly groupsPillButton: Locator;
  readonly apiKeysPillButton: Locator;

  constructor(page: Page) {
    this.usersPillButton = page.getByRole('link', { name: 'Users' });
    this.rolesPillButton = page.getByRole('link', { name: 'Roles' });
    this.groupsPillButton = page.getByRole('link', { name: 'Groups' });
    this.apiKeysPillButton = page.getByRole('link', { name: 'API Keys' });
  }
}