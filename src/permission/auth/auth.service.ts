import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return {
      access_token: await this.jwtService.signAsync({ user }),
    };
  }
}
