import { KEY_REG } from '@common/constants/reg';
import { z } from 'zod';

export const roleSchema = z
  .object({
    key: z.string({ required_error: 'key 不能为空' }).regex(KEY_REG, { message: 'key 只能使用下划线和字母的组合' }),
    name: z.string({ required_error: '名称不能为空' }),
  })
  .required();
export type RoleDto = z.infer<typeof roleSchema>;
