import { SecurityScorecardConnectionTab } from '../../componentObjectModels/tabs/securityScorecardConnectionTab';
import { Page } from '../../fixtures';
import { EditConnectorPage } from './editConnectorPage';

export class EditSecurityScorecardConnectorPage extends EditConnectorPage {
  readonly connectionTab: SecurityScorecardConnectionTab;

  constructor(page: Page) {
    super(page);
    this.connectionTab = new SecurityScorecardConnectionTab(this.page);
  }
}
