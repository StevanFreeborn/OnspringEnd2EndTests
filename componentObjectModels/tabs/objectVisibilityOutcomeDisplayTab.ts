import { FrameLocator, Locator } from '@playwright/test';
import { ObjectVisibilitySection } from '../../models/objectVisibilityOutcome';

export class ObjectVisibilityOutcomeDisplayTab {
  private readonly modal: FrameLocator;
  private readonly layoutSelector: Locator;

  constructor(modal: FrameLocator) {
    this.modal = modal;
    this.layoutSelector = modal.locator('.label:has-text("Layout") + .data').getByRole('listbox');
  }

  async selectLayout(layout: string) {
    await this.layoutSelector.click();

    const page = this.layoutSelector.page();

    await page.getByRole('option', { name: layout }).click();
  }

  async updateSectionVisibility(section: ObjectVisibilitySection) {
    const outcomeLayout = this.modal.locator('.outcome-layout');
    const tabLocator = outcomeLayout.locator('.tab', {
      hasText: section.tabName,
    });

    const tabClasses = await tabLocator.getAttribute('class');

    if (tabClasses === null) {
      throw new Error(`Could not find classes for tab: ${section.tabName}`);
    }

    if (tabClasses.includes('collapsed')) {
      await tabLocator.click();
    }

    const sectionLocator = tabLocator.locator('.outcome-section', {
      hasText: section.name,
    });

    await sectionLocator.hover();
    await sectionLocator.getByRole('radio', { name: section.visibility }).click();
  }
}
