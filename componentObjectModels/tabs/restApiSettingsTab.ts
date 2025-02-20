import { Locator } from "@playwright/test";
import { RestApiOutcome } from "../../models/restApiOutcome";

export class RestApiSettingsTab {
  private readonly httpMethodSelector: Locator;
  private readonly restURLInput: Locator;
  private readonly authorizationTypeSelector: Locator;

  constructor(modal: Locator) {
    this.httpMethodSelector = modal.locator('.label:has-text("HTTP Method") + .data').getByRole('listbox');
    this.restURLInput = modal.locator('.label:has-text("REST URL") + .data').getByRole('textbox');
    this.authorizationTypeSelector = modal.locator('.label:has-text("Authorization Type") + .data').getByRole('listbox');
  }

  private async selectHttpMethod(httpMethod: string) {
    await this.httpMethodSelector.click();
    await this.httpMethodSelector.page().getByRole('option', { name: httpMethod }).click();
  }

  private async selectAuthorizationType(authorizationType: string) {
    await this.authorizationTypeSelector.click();
    await this.authorizationTypeSelector.page().getByRole('option', { name: authorizationType }).click();
  }

  async fillOutForm(outcome: RestApiOutcome) {
    await this.selectHttpMethod(outcome.method);
    await this.restURLInput.fill(outcome.restURL);
    await this.selectAuthorizationType(outcome.authorization);
  }
}

