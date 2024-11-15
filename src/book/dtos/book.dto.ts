import { z } from 'zod';

export const addBookSchema = z
  .object({
    isbn: z.string({ required_error: '书号不能为空' }),
    title: z.string({ required_error: '书名不能为空' }),
    author: z.string({ required_error: '作者不能为空' }),
    publisher: z.string().optional(),
    published: z.string().optional(),
    cover: z.string().optional(),
  })
  .required();

export type AddBookDto = z.infer<typeof addBookSchema>;
