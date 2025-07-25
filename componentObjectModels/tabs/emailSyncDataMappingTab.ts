import { Page } from '../../fixtures';
import { EmailSync } from '../../models/emailSync';
import { MappingGrid } from '../controls/mappingGrid';

export class EmailSyncDataMappingTab {
  private readonly mappingGrid: MappingGrid;

  constructor(page: Page) {
    const mappingGridContainer = page.locator('.section', {
      has: page.getByRole('heading', { name: /field mapping/i }),
    });
    this.mappingGrid = new MappingGrid(mappingGridContainer);
  }

  async fillOutForm(emailSync: EmailSync) {
    const mappings = Object.entries(emailSync.dataMapping).map(([key, value]) => ({ [key]: value }));
    await this.mappingGrid.performMapping(mappings);
  }
}
