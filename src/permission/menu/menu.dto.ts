import { KEY_REG } from '@common/constants/reg';
import { z } from 'zod';

export const menuSchema = z.object({
  key: z.string({ required_error: 'key 不能为空' }).regex(KEY_REG, { message: 'key 只能使用下划线和字母的组合' }),
  name: z.string({ required_error: '名称不能为空' }),
  parent: z.string().optional(),
});
export type MenuDto = z.infer<typeof menuSchema>;
