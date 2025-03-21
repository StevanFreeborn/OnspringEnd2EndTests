import { Locator, Page } from '../../fixtures';
import { CreateContentLinks } from '../../models/createContentLinks';
import { DualPaneSelector } from '../controls/dualPaneSelector';

export class AddOrEditCreateContentLinksObjectModal {
  private readonly modal: Locator;
  private readonly generalTabButton: Locator;
  private readonly nameInput: Locator;
  private readonly addLinkButton: Locator;
  private readonly linksGridBody: Locator;
  private readonly hideHeaderCheckbox: Locator;
  private readonly hideContainerCheckbox: Locator;
  private readonly securityTabButton: Locator;
  private readonly viewSelector: Locator;
  private readonly rolesSelector: DualPaneSelector;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: /Add.*Object/ });
    this.generalTabButton = this.modal.getByRole('tab', { name: 'General' });
    this.nameInput = this.modal.locator('.label:has-text("Name") + .data').getByRole('textbox');
    this.addLinkButton = this.modal.getByRole('button', { name: 'Add a Link' });
    this.linksGridBody = this.modal.locator('.label:has-text("Links") + .data').locator('.k-grid-content');
    this.hideHeaderCheckbox = this.modal.getByRole('checkbox', { name: 'Hide object header' });
    this.hideContainerCheckbox = this.modal.getByRole('checkbox', { name: 'Hide object container' });
    this.securityTabButton = this.modal.getByRole('tab', { name: 'Security' });
    this.viewSelector = this.modal.locator('.label:has-text("View") + .data').getByRole('listbox');
    this.rolesSelector = new DualPaneSelector(this.modal.locator('.label:has-text("Roles") + .data .onx-selector'));
    this.saveButton = this.modal.getByRole('button', { name: 'Save' });
  }

  private async selectView(view: string) {
    await this.viewSelector.click();
    await this.viewSelector.page().getByRole('option', { name: view }).click();
  }

  private async addLinks(createContentLinks: CreateContentLinks) {
    for (const link of createContentLinks.links) {
      await this.addLinkButton.click();
      const lastRow = this.linksGridBody.locator('tr').last();
      const appSelector = lastRow.locator('td').nth(1).getByRole('listbox');
      const sourceSelector = lastRow.locator('td').nth(2).getByRole('listbox');
      const linkTextInput = lastRow.locator('td').nth(4).getByRole('textbox');

      await appSelector.click();
      await appSelector.page().getByRole('option', { name: link.app }).click();

      if (link.imageSource.src === 'Library') {
        throw new Error('Not implemented');
      }

      await sourceSelector.click();
      await sourceSelector.page().getByRole('option', { name: link.imageSource.src }).click();

      await linkTextInput.fill(link.linkText);
    }
  }

  async fillOutForm(createContentLinks: CreateContentLinks) {
    await this.generalTabButton.click();
    await this.nameInput.fill(createContentLinks.name);
    await this.addLinks(createContentLinks);
    await this.hideHeaderCheckbox.setChecked(createContentLinks.hideHeader);
    await this.hideContainerCheckbox.setChecked(createContentLinks.hideContainer);

    await this.securityTabButton.click();
    await this.selectView(createContentLinks.view);

    if (createContentLinks.view === 'Private by Role') {
      await this.rolesSelector.selectOptions(createContentLinks.roles);
    }
  }

  async save() {
    await this.saveButton.click();
    await this.modal.waitFor({ state: 'hidden' });
  }
}
