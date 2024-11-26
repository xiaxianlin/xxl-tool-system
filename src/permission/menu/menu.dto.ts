import { z } from 'zod';

export const menuSchema = z
  .object({
    key: z
      .string({ required_error: 'key 不能为空' })
      .regex(/^[A-Za-z_]+$/, { message: 'key 只能使用下划线和字母的组合' }),
    name: z.string({ required_error: '名称不能为空' }),
    group: z.string({ required_error: '分组不能为空' }),
  })
  .required();
export type MenuDto = z.infer<typeof menuSchema>;

export const groupSchema = z
  .object({
    key: z
      .string({ required_error: 'key 不能为空' })
      .regex(/^[A-Za-z_]+$/, { message: 'key 只能使用下划线和字母的组合' }),
    name: z.string({ required_error: '名称不能为空' }),
  })
  .required();
export type GroupDto = z.infer<typeof groupSchema>;
