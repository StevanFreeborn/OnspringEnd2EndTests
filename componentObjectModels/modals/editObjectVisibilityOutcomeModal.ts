import { Locator, Page } from '@playwright/test';
import { ObjectVisibilityOutcome } from '../../models/objectVisibilityOutcome';
import { ObjectVisibilityOutcomeDisplayTab } from '../tabs/objectVisibilityOutcomeDisplayTab';
import { EditOutcomeModal } from './editOutcomeModal';

export class EditObjectVisibilityOutcomeModal extends EditOutcomeModal {
  readonly displayTabButton: Locator;
  readonly displayTab: ObjectVisibilityOutcomeDisplayTab;

  constructor(page: Page) {
    super(page);
    this.displayTabButton = this.modal.getByRole('tab', { name: 'Display' });
    this.displayTab = new ObjectVisibilityOutcomeDisplayTab(this.modal);
  }

  async fillOutForm(outcome: ObjectVisibilityOutcome) {
    await super.fillOutForm(outcome);

    await this.displayTabButton.click();
    await this.displayTab.selectLayout(outcome.layoutName);

    for (const section of outcome.sections) {
      await this.displayTab.updateSectionVisibility(section);
    }
  }
}
