import { RapidRatingsConnectionTab } from '../../componentObjectModels/tabs/rapidRatingsConnectionTab';
import { Page } from '../../fixtures';
import { EditConnectorPage } from './editConnectorPage';

export class EditRapidRatingsConnectorPage extends EditConnectorPage {
  readonly connectionTab: RapidRatingsConnectionTab;

  constructor(page: Page) {
    super(page);
    this.connectionTab = new RapidRatingsConnectionTab(this.page);
  }
}
