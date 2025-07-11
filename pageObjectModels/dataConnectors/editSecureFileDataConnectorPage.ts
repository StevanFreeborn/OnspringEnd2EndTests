import { Page } from "@playwright/test";
import { EditConnectorPage } from "./editConnectorPage";
import { SecureFileConnectionTab } from "../../componentObjectModels/tabs/secureFileConnectionTab";

export class EditSecureFileDataConnectorPage extends EditConnectorPage {
  connectionTab: SecureFileConnectionTab;
  
  constructor(page: Page) {
    super(page);
    this.connectionTab = new SecureFileConnectionTab(page);
  }
}
