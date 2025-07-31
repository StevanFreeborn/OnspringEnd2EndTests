import { RiskReconConnectionTab } from '../../componentObjectModels/tabs/riskReconConnectionTab';
import { Page } from '../../fixtures';
import { EditConnectorPage } from './editConnectorPage';

export class EditRiskReconConnectorPage extends EditConnectorPage {
  readonly connectionTab: RiskReconConnectionTab;

  constructor(page: Page) {
    super(page);
    this.connectionTab = new RiskReconConnectionTab(this.page);
  }
}
