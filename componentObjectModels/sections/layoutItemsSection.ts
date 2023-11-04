import { FrameLocator, Locator } from '@playwright/test';
import { LayoutDesignerFieldsTab } from '../tabs/layoutDesignerFieldsTab';
import { LayoutDesignerObjectsTab } from '../tabs/layoutDesignerObjectsTab';

export class LayoutItemsSection {
  private readonly section: Locator;
  readonly tabStrip: Locator;
  readonly fieldsTabButton: Locator;
  readonly objectsTabButton: Locator;
  readonly fieldsTab: LayoutDesignerFieldsTab;
  readonly objectsTab: LayoutDesignerObjectsTab;

  constructor(frame: FrameLocator) {
    this.section = frame.locator('.item-container').first();
    this.tabStrip = this.section.locator('#tabstrip-container');
    this.fieldsTabButton = this.tabStrip.getByText('Fields');
    this.objectsTabButton = this.tabStrip.getByText('Objects');
    this.fieldsTab = new LayoutDesignerFieldsTab(frame);
    this.objectsTab = new LayoutDesignerObjectsTab(frame);
  }
}
