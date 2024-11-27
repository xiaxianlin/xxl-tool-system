import { Injectable } from '@nestjs/common';
import { UserAccountService } from '@user/account/user-account.service';
import { validatePassword } from '@common/utils/auth';
import { JwtService } from '@nestjs/jwt';
import { InternalException } from '@common/expceptions/internal.exception';

@Injectable()
export class AuthService {
  constructor(private userAccountService: UserAccountService, private jwtService: JwtService) {}

  async validateUser(username: string, password: string) {
    const user = await this.userAccountService.getActiveUser({ username });
    const isMatch = await validatePassword(password, user.password);
    if (!isMatch) {
      throw new InternalException('用户名或密码错误');
    }
    return user;
  }

  async login(user: any) {
    return { access_token: this.jwtService.sign({ user }) };
  }
}
