type DashboardObjectItemType = 'App Search' | 'Create Content Links' | 'Formatted Text Block' | 'Web Page';

type DashboardObjectItemViewSecurity = 'Public' | 'Private by Role';

export type DashboardObjectItemObject = {
  name: string;
  type: DashboardObjectItemType;
  hideHeader?: boolean;
  hideContainer?: boolean;
  view?: DashboardObjectItemViewSecurity;
  roles?: string[];
};

export abstract class DashboardObjectItem {
  name: string;
  type: DashboardObjectItemType;
  hideHeader: boolean;
  hideContainer: boolean;
  view: DashboardObjectItemViewSecurity;
  roles: string[];

  constructor({
    name,
    type,
    hideHeader = false,
    hideContainer = false,
    view = 'Public',
    roles = [],
  }: DashboardObjectItemObject) {
    this.name = name;
    this.type = type;
    this.hideHeader = hideHeader;
    this.hideContainer = hideContainer;
    this.view = view;
    this.roles = roles;
  }
}
