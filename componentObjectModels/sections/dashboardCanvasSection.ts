import { FrameLocator } from '@playwright/test';
import { BaseCanvasSection } from './baseCanvasSection';
import { BaseLayoutSection } from './baseLayoutSection';

export class DashboardCanvasSection extends BaseCanvasSection {
  private readonly layoutSection: BaseLayoutSection;

  constructor(frame: FrameLocator) {
    super(frame);
    this.layoutSection = new BaseLayoutSection(this.section.locator('.mainContainer .section'));
  }

  async getItemDropzone(row: number, column: number) {
    return this.layoutSection.getDropzone(row, column);
  }
}
