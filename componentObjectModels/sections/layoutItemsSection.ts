import { FrameLocator, Locator } from '@playwright/test';
import { LayoutDesignerFieldsTab } from '../tabs/layoutDesignerFieldsTab';
import { LayoutDesignerObjectsTab } from '../tabs/layoutDesignerObjectsTab';
import { BaseLayoutItemsSection } from './baseLayoutItemsSection';

export class LayoutItemsSection extends BaseLayoutItemsSection {
  readonly fieldsTabButton: Locator;
  readonly objectsTabButton: Locator;
  readonly fieldsTab: LayoutDesignerFieldsTab;
  readonly objectsTab: LayoutDesignerObjectsTab;

  constructor(frame: FrameLocator) {
    super(frame);
    this.fieldsTabButton = this.tabsContainer.getByText('Fields');
    this.objectsTabButton = this.tabsContainer.getByText('Objects');
    this.fieldsTab = new LayoutDesignerFieldsTab(frame);
    this.objectsTab = new LayoutDesignerObjectsTab(frame);
  }
}
