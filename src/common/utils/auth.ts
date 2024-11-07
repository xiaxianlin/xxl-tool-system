import * as bcrypt from 'bcrypt';

export const encodePassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const validatePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
