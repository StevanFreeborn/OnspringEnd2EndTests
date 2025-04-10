type ViewSecurity = 'Public' | 'Private by Role';

type DashboardFormattedTextBlockObject = {
  name: string;
  formattedText?: string;
  hideHeader?: boolean;
  hideContainer?: boolean;
  view?: ViewSecurity;
  roles?: string[];
};

export class DashboardFormattedTextBlock {
  name: string;
  formattedText: string;
  hideHeader: boolean;
  hideContainer: boolean;
  view: ViewSecurity;
  roles: string[];

  constructor({
    name,
    formattedText = '',
    hideHeader = false,
    hideContainer = false,
    view = 'Public',
    roles = [],
  }: DashboardFormattedTextBlockObject) {
    this.name = name;
    this.formattedText = formattedText;
    this.hideHeader = hideHeader;
    this.hideContainer = hideContainer;
    this.view = view;
    this.roles = roles;
  }
}
