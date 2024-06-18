import { BitsightDataConnector } from '../../models/bitsightDataConnector';
import { AppMappingTab } from './appMappingTab';

export class BitsightAppMappingTab extends AppMappingTab {
  async fillOutForm(dataConnector: BitsightDataConnector) {
    const mappings = dataConnector.getAllAppMappings();
    await this.mappingGrid.performMapping(mappings);
  }
}
