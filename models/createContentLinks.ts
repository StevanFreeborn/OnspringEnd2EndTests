import { DashboardObjectItem, DashboardObjectItemObject } from './dashboardObjectItem';

type Link = {
  app: string;
  imageSource: { src: 'None' } | { src: 'App' } | { src: 'Library'; imageName: string };
  linkText: string;
};

type CreateContentLinksObject = Omit<DashboardObjectItemObject, 'type'> & {
  links: Link[];
};

export class CreateContentLinks extends DashboardObjectItem {
  links: Link[];

  constructor({
    name,
    links,
    hideHeader = false,
    hideContainer = false,
    view = 'Public',
    roles = [],
  }: CreateContentLinksObject) {
    super({ name, type: 'Create Content Links', hideHeader, hideContainer, view, roles });

    this.links = links;

    if (this.links.length === 0) {
      throw new Error('Links must not be empty');
    }
  }

  clone() {
    return new CreateContentLinks({
      name: this.name,
      links: [...this.links],
      hideHeader: this.hideHeader,
      hideContainer: this.hideContainer,
      view: this.view,
      roles: [...this.roles],
    });
  }
}
