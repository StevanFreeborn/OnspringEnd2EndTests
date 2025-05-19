import { DashboardObjectItem, DashboardObjectItemObject } from "./dashboardObjectItem";

type WebPageObject = Omit<DashboardObjectItemObject, 'type'> & {
  url: string;
  forceRefresh?: boolean;
};

export class WebPage extends DashboardObjectItem {
  url: string;
  forceRefresh: boolean;

  constructor({
    name,
    url,
    forceRefresh = false,
    hideHeader = false,
    hideContainer = false,
    view = 'Public',
    roles = [],
  }: WebPageObject) {
    super({ name, type: 'Web Page', hideHeader, hideContainer, view, roles });

    this.url = url;
    this.forceRefresh = forceRefresh;
  }
}
