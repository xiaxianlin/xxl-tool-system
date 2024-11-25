import { Injectable, Logger } from '@nestjs/common';
import { RoleService } from '@permission/role/role.service';
import { UserService } from '@user/services/user.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private userService: UserService,
    private roleService: RoleService,
  ) {}
  async initData() {
    this.logger.log('>>>>>>>> Begin Init Data <<<<<<<<<');
    await Promise.all([
      this.userService.initAdmin(
        process.env.ADMIN_USERNAME,
        process.env.ADMIN_PASSWORD,
      ),
      this.roleService.initRole(
        process.env.ADMIN_ROLE_KEY,
        process.env.ADMIN_ROLE_NAME,
      ),
    ]);
    this.logger.log('>>>>>>>> Init Data Completed <<<<<<<<<');
  }
}
