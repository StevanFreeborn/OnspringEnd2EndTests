import { Locator, Page } from '../../fixtures';
import { CreateContentLinks } from '../../models/createContentLinks';
import { AddOrEditDashboardObjectItemModal } from './addOrEditDashboardObjectItemModal';

export class AddOrEditCreateContentLinksObjectModal extends AddOrEditDashboardObjectItemModal {
  private readonly addLinkButton: Locator;
  private readonly linksGridBody: Locator;

  constructor(page: Page) {
    super(page);

    this.addLinkButton = this.modal.getByRole('button', { name: 'Add a Link' });
    this.linksGridBody = this.modal.locator('.label:has-text("Links") + .data').locator('.k-grid-content');
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
    await this.fillOutGeneralTab(createContentLinks);
    await this.addLinks(createContentLinks);

    await this.fillOutSecurityTab(createContentLinks);
  }
}
