import { Role } from '@permission/role/enums/role.enum';

export interface UserMainWhere {
  uid?: string;
  username?: string;
}

export interface UserSearchParams {
  username?: string;
  role?: Role;
  status?: number;
  page?: number;
  size?: number;
}
