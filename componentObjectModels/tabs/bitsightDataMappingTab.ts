import { Page } from '@playwright/test';
import { BitsightDataConnector } from '../../models/bitsightDataConnector';
import { MultiAppDataMappingTab } from './multiAppDataMappingTab';

export class BitsightDataMapping extends MultiAppDataMappingTab {
  constructor(page: Page) {
    super(page);
  }

  async fillOutForm(dataConnector: BitsightDataConnector) {
    const { alertsMapping, portfolioMapping, ratingDetailsMapping } = dataConnector.appMappings;
    const appMappings = [alertsMapping, portfolioMapping, ratingDetailsMapping];

    for (const appMapping of appMappings) {
      for (const fieldMapping of Object.values(appMapping)) {
        await this.getExpandButton(fieldMapping.appName).click();
        const { recordHandling, sourceMatchField, appMatchField, messagingRule, ...fieldMappings } =
          fieldMapping.mappings;

        await this.mappingGrid.performMapping(Object.values(fieldMappings));
        await this.selectRecordHandlingOption(recordHandling);

        if (recordHandling !== 'Add new content for each record in the file') {
          await this.selectSourceMatchFieldOption(sourceMatchField);
          await this.selectAppMatchFieldOption(appMatchField);
        }

        await this.selectMessagingOption(messagingRule);
      }
    }
  }
}
