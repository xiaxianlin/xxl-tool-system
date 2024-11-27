import e from 'express';
import { z } from 'zod';

export const createUserSchema = z
  .object({
    username: z.string({ required_error: '账号不能为空' }),
    password: z.string({ required_error: '密码不能为空' }),
    role: z.string({ required_error: '角色不能为空' }),
  })
  .required();
export type CreateUserDto = z.infer<typeof createUserSchema>;

export const modifyUserSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  role: z.string().optional(),
});
export type ModifyUserDto = z.infer<typeof modifyUserSchema>;

/** 修改密码 */
export const modifyPasswordSchema = z.object({
  oldValue: z.string({ required_error: '旧密码不能为空' }),
  newValue: z.string({ required_error: '新密码不能为空' }),
});
export type ModifyPasswordDto = z.infer<typeof modifyPasswordSchema>;

export type UserSearchDto = {
  username?: string;
  role?: string;
  status?: number;
  page?: number;
  size?: number;
};
