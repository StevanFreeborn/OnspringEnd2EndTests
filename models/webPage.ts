type ViewSecurity = 'Public' | 'Private by Role';

type WebPageObject = {
  name: string;
  url: string;
  forceRefresh?: boolean;
  hideHeader?: boolean;
  hideContainer?: boolean;
  view?: ViewSecurity;
  roles?: string[];
};

export class WebPage {
  name: string;
  url: string;
  forceRefresh: boolean;
  hideHeader: boolean;
  hideContainer: boolean;
  view: ViewSecurity;
  roles: string[];

  constructor({
    name,
    url,
    forceRefresh = false,
    hideHeader = false,
    hideContainer = false,
    view = 'Public',
    roles = [],
  }: WebPageObject) {
    this.name = name;
    this.url = url;
    this.forceRefresh = forceRefresh;
    this.hideHeader = hideHeader;
    this.hideContainer = hideContainer;
    this.view = view;
    this.roles = roles;
  }
}
