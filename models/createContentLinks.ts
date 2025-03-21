type Link = {
  app: string;
  imageSource: { src: 'None' } | { src: 'App' } | { src: 'Library'; imageName: string };
  linkText: string;
};

type ViewSecurity = 'Public' | 'Private by Role';

type CreateContentLinksObject = {
  name: string;
  links: Link[];
  hideHeader?: boolean;
  hideContainer?: boolean;
  view?: ViewSecurity;
  roles?: string[];
};

export class CreateContentLinks {
  name: string;
  links: Link[];
  hideHeader: boolean;
  hideContainer: boolean;
  view: ViewSecurity;
  roles: string[];

  constructor({
    name,
    links,
    hideHeader = false,
    hideContainer = false,
    view = 'Public',
    roles = [],
  }: CreateContentLinksObject) {
    this.name = name;
    this.links = links;
    this.hideHeader = hideHeader;
    this.hideContainer = hideContainer;
    this.view = view;
    this.roles = roles;

    if (this.links.length === 0) {
      throw new Error('Links must not be empty');
    }
  }
}
