type SectionObject = {
  tabName: string;
  sectionName: string;
};

export class Section {
  tabName: string;
  sectionName: string;

  constructor({ tabName, sectionName }: SectionObject) {
    this.tabName = tabName;
    this.sectionName = sectionName;
  }
}
