import { BlackKiteConnectionTab } from '../../componentObjectModels/tabs/blackKiteConnectionTab';
import { Page } from '../../fixtures';
import { EditConnectorPage } from './editConnectorPage';

export class EditBlackKiteConnectorPage extends EditConnectorPage {
  readonly connectionTab: BlackKiteConnectionTab;

  constructor(page: Page) {
    super(page);
    this.connectionTab = new BlackKiteConnectionTab(this.page);
  }
}
