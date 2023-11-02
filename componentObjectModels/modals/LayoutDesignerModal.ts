import { Locator, Page } from '@playwright/test';
import { CanvasSection } from '../sections/canvasSection';
import { LayoutItemsSection } from '../sections/layoutItemsSection';

export class LayoutDesignerModal {
  private readonly designer: Locator;
  readonly layoutItemsSection: LayoutItemsSection;
  readonly canvasSection: CanvasSection;

  constructor(page: Page) {
    this.designer = page.getByRole('dialog', { name: 'Layout Designer' });
    this.layoutItemsSection = new LayoutItemsSection(page);
    this.canvasSection = new CanvasSection(page);
  }
}
