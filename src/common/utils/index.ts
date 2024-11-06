import { Role } from '@permission/role/enums/role.enum';

export const isAdmin = (user: any) => user?.role === Role.Admin;
