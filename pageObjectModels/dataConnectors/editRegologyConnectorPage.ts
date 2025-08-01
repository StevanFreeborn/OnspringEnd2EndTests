import { RegologyConnectionTab } from '../../componentObjectModels/tabs/regologyConnectionTab';
import { Page } from '../../fixtures';
import { EditConnectorPage } from './editConnectorPage';

export class EditRegologyConnectorPage extends EditConnectorPage {
  readonly connectionTab: RegologyConnectionTab;

  constructor(page: Page) {
    super(page);
    this.connectionTab = new RegologyConnectionTab(this.page);
  }
}
