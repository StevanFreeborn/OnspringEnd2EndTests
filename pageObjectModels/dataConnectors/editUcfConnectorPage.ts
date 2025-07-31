import { UcfConnectionTab } from '../../componentObjectModels/tabs/ucfConnectionTab';
import { Page } from '../../fixtures';
import { EditConnectorPage } from './editConnectorPage';

export class EditUcfConnectorPage extends EditConnectorPage {
  connectionTab: UcfConnectionTab;

  constructor(page: Page) {
    super(page);
    this.connectionTab = new UcfConnectionTab(this.page);
  }
}
