import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/services/user.service';
import { UserEntity } from '@user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.exists(username);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return user;
  }

  async login(user: UserEntity) {
    return { access_token: this.jwtService.sign({ user }) };
  }
}
