import { AscentConnectionTab } from '../../componentObjectModels/tabs/ascentConnectionTab';
import { Page } from '../../fixtures';
import { EditConnectorPage } from './editConnectorPage';

export class EditAscentConnectorPage extends EditConnectorPage {
  readonly connectionTab: AscentConnectionTab;

  constructor(page: Page) {
    super(page);
    this.connectionTab = new AscentConnectionTab(this.page);
  }
}
