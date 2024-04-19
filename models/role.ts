export type RoleStatus = 'Active' | 'Inactive';

export interface ReadOnlyPermission {
  read: boolean;
}

export interface ReadAndUpdatePermission extends ReadOnlyPermission {
  update: boolean;
}

export interface CRUDPermission extends ReadAndUpdatePermission {
  create: boolean;
  delete: boolean;
}

export interface EnableOnlyPermission {
  enable: boolean;
}

type PermissionObj = {
  create?: boolean;
  read?: boolean;
  update?: boolean;
  del?: boolean;
  enable?: boolean;
};

export class Permission implements ReadOnlyPermission, EnableOnlyPermission, ReadAndUpdatePermission, CRUDPermission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  enable: boolean;

  constructor({ create = false, read = false, update = false, del = false, enable = false }: PermissionObj = {}) {
    this.create = create;
    this.read = read;
    this.update = update;
    this.delete = del;
    this.enable = enable;
  }
}

type AppPermissionObj = {
  appName?: string;
  contentRecords?: Permission;
  referencedRecords?: ReadAndUpdatePermission;
  versionHistory?: ReadOnlyPermission;
  contentAdmin?: EnableOnlyPermission;
  reportAdmin?: EnableOnlyPermission;
  privateReportAdmin?: EnableOnlyPermission;
};

export class AppPermission {
  appName: string;
  contentRecords: CRUDPermission;
  referencedRecords: ReadAndUpdatePermission;
  versionHistory: ReadOnlyPermission;
  contentAdmin: EnableOnlyPermission;
  reportAdmin: EnableOnlyPermission;
  privateReportAdmin: EnableOnlyPermission;

  constructor({
    appName = '',
    contentRecords = new Permission(),
    referencedRecords = new Permission(),
    versionHistory = new Permission(),
    contentAdmin = new Permission(),
    reportAdmin = new Permission(),
    privateReportAdmin = new Permission(),
  }: AppPermissionObj = {}) {
    this.appName = appName;
    this.contentRecords = contentRecords;
    this.referencedRecords = referencedRecords;
    this.versionHistory = versionHistory;
    this.contentAdmin = contentAdmin;
    this.reportAdmin = reportAdmin;
    this.privateReportAdmin = privateReportAdmin;
  }
}

type AdminReportPermissionObj = {
  reportName?: string;
  permission?: ReadOnlyPermission;
};

export class AdminReportPermission {
  reportName: string;
  permission: ReadOnlyPermission;

  constructor({ reportName = '', permission = new Permission() }: AdminReportPermissionObj = {}) {
    this.reportName = reportName;
    this.permission = permission;
  }
}

type RoleObj = {
  id?: number;
  name?: string;
  description?: string;
  status?: RoleStatus;
  appPermissions?: AppPermission[];
  adminReportPermissions?: AdminReportPermission[];
};

export class Role {
  id: number;
  name: string;
  description: string;
  status: RoleStatus;
  appPermissions: AppPermission[];
  adminReportPermissions: AdminReportPermission[];

  constructor({
    id = 0,
    name = '',
    description = '',
    status = 'Inactive',
    appPermissions = [],
    adminReportPermissions = [],
  }: RoleObj = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.appPermissions = appPermissions;
    this.adminReportPermissions = adminReportPermissions;
  }
}
