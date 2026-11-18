import { Locator, Page } from '@playwright/test';

export const GroupsPageTargets = {
  route: '/Admin/Security/Group',
  getGroupsPath: '/Admin/Security/Group/GroupList',
  deleteGroupPathRegex: /\/Admin\/Security\/Group\/\d+\/Delete/,
  createGroupButton: (page: Page): Locator => page.getByRole('button', { name: 'Create Group' }),
  groupsGrid: (page: Page): Locator => page.locator('#grid'),
  rowByName: (groupName: string) => (page: Page): Locator =>
    page.locator('#grid').getByRole('row', { name: groupName }).first(),
  deleteButtonInRow: (groupName: string) => (page: Page): Locator =>
    page.locator('#grid').getByRole('row', { name: groupName }).first().getByTitle('Delete Group'),
};

export const AddGroupPageTargets = {
  route: '/Admin/Security/Group/Add',
  nameInput: (page: Page): Locator => page.locator('.data-Name input'),
  saveRecordButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Record' }),
};

export const EditGroupPageTargets = {
  pathRegex: /\/Admin\/Security\/Group\/\d+\/Edit/,
};
