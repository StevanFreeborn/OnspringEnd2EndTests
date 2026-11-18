import { User, UserStatus as UserStatusType } from '@stevanfreeborn/onspring-models';

export const UserStatus = {
  Active: 'Active' as UserStatusType,
  Inactive: 'Inactive' as UserStatusType,
  Locked: 'Locked' as UserStatusType,
};

export type UserStatus = UserStatusType;
export { User };
