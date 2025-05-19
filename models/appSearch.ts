import { DashboardObjectItem, DashboardObjectItemObject } from './dashboardObjectItem';

type AppSearchObject = Omit<DashboardObjectItemObject, 'type'> & {
  apps: string[];
};

export class AppSearch extends DashboardObjectItem {
  apps: string[];

  constructor({ name, apps, hideHeader = false, hideContainer = false, view = 'Public', roles = [] }: AppSearchObject) {
    super({ name, type: 'App Search', hideHeader, hideContainer, view, roles });
    
    this.apps = apps;

    if (this.apps.length === 0) {
      throw new Error('App Search object must have at least one app');
    }
  }
}
