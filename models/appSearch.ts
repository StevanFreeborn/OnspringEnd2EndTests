type ViewSecurity = 'Public' | 'Private by Role';

type AppSearchObject = {
  name: string;
  apps: string[];
  hideHeader?: boolean;
  hideContainer?: boolean;
  view?: ViewSecurity;
  roles?: string[];
};

export class AppSearch {
  name: string;
  apps: string[];
  hideHeader: boolean;
  hideContainer: boolean;
  view: ViewSecurity;
  roles: string[];

  constructor({ name, apps, hideHeader = false, hideContainer = false, view = 'Public', roles = [] }: AppSearchObject) {
    this.name = name;
    this.apps = apps;
    this.hideHeader = hideHeader;
    this.hideContainer = hideContainer;
    this.view = view;
    this.roles = roles;

    if (this.apps.length === 0) {
      throw new Error('App Search object must have at least one app');
    }
  }
}
