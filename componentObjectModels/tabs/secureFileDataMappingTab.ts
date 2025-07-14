import { Page } from '../../fixtures';
import { SecureFileDataConnector } from '../../models/secureFileDataConnector';
import { MappingGrid } from '../controls/mappingGrid';

export class SecureFileDataMappingTab {
  private readonly mappingGrid: MappingGrid;

  constructor(page: Page) {
    this.mappingGrid = new MappingGrid(page.locator('#mapping-container .layoutDesigner'));
  }

  async fillOutForm(dataConnector: SecureFileDataConnector) {
    await this.mappingGrid.performMapping(dataConnector.fieldMapping);
  }
}
