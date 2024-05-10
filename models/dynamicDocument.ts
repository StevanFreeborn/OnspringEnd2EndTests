type RoleAccess = 'Anyone who can view the content record' | 'Restrict access to specific roles';

type EmailAccess =
  | 'Allow link access only'
  | 'Allow email attachment only'
  | 'Allow both link access and email attachments'
  | 'Do not allow documents to be emailed';

type FileType = 'Microsoft Word Only' | 'PDF Only' | 'Microsoft Word or PDF';

type SaveToFieldAccess = 'Not Allowed' | 'Allowed';

type DynamicDocumentObject = {
  name: string;
  status?: boolean;
  templatePath: string;
  fieldsToOverride?: string[];
  overrideContentSecurity?: boolean;
  roleAccess?: RoleAccess;
  roles?: string[];
  emailAccess?: EmailAccess;
  fileType?: FileType;
  saveToFieldAccess?: SaveToFieldAccess;
  attachmentField?: string;
};

export class DynamicDocument {
  name: string;
  status: boolean;
  templatePath: string;
  fieldsToOverride: string[];
  overrideContentSecurity: boolean;
  roleAccess: RoleAccess;
  roles: string[];
  emailAccess: EmailAccess;
  fileType: FileType;
  saveToFieldAccess: SaveToFieldAccess;
  attachmentField: string;

  constructor({
    name,
    status = false,
    templatePath,
    fieldsToOverride = [],
    overrideContentSecurity = false,
    roleAccess = 'Anyone who can view the content record',
    roles = [],
    emailAccess = 'Allow link access only',
    fileType = 'Microsoft Word Only',
    saveToFieldAccess = 'Not Allowed',
    attachmentField = '',
  }: DynamicDocumentObject) {
    if (roleAccess === 'Restrict access to specific roles' && roles.length === 0) {
      throw new Error('You must provide at least one role if you are restricting access to specific roles.');
    }

    if (saveToFieldAccess === 'Allowed' && attachmentField === '') {
      throw new Error('You must provide an attachment field if saving to a field is allowed.');
    }

    this.name = name;
    this.status = status;
    this.templatePath = templatePath;
    this.fieldsToOverride = fieldsToOverride;
    this.overrideContentSecurity = overrideContentSecurity;
    this.roleAccess = roleAccess;
    this.roles = roles;
    this.emailAccess = emailAccess;
    this.fileType = fileType;
    this.saveToFieldAccess = saveToFieldAccess;
    this.attachmentField = attachmentField;
  }
}
