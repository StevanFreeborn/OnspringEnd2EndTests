import { DashboardObjectItem, DashboardObjectItemObject } from './dashboardObjectItem';

type DashboardFormattedTextBlockObject = Omit<DashboardObjectItemObject, 'type'> & {
  formattedText?: string;
};

export class DashboardFormattedTextBlock extends DashboardObjectItem {
  formattedText: string;

  constructor({
    name,
    formattedText = '',
    hideHeader = false,
    hideContainer = false,
    view = 'Public',
    roles = [],
  }: DashboardFormattedTextBlockObject) {
    super({
      name,
      type: 'Formatted Text Block',
      hideHeader,
      hideContainer,
      view,
      roles,
    });

    this.formattedText = formattedText;
  }
}
