import { Role } from '@permission/role/enums/role.enum';
import { z } from 'zod';

export const createUserSchema = z
  .object({
    username: z.string({
      required_error: '账号不能为空',
      invalid_type_error: '账号输入不合法',
    }),
    password: z.string({
      required_error: '密码不能为空',
      invalid_type_error: '密码输入不合法',
    }),
    role: z.enum([Role.Manager, Role.User, Role.Guest], {
      message: '角色类型不匹配',
    }),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const updatePasswordSchema = z.object({
  oldValue: z.string({
    required_error: '密码不能为空',
    invalid_type_error: '密码输入不合法',
  }),
  newValue: z.string({
    required_error: '密码不能为空',
    invalid_type_error: '密码输入不合法',
  }),
});

export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;

export const updateUsernameSchema = z.object({
  username: z.string({
    required_error: '密码不能为空',
    invalid_type_error: '密码输入不合法',
  }),
});

export type UpdateUsernameDto = z.infer<typeof updateUsernameSchema>;
