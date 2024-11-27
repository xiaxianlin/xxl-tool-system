import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountModule } from '@user/account/user-account.module';
import { AuthModule } from '@permission/auth/auth.module';
import { RoleModule } from '@permission/role/role.module';
import { BookModule } from '@book/book.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserAccountService } from '@user/account/user-account.service';
import { JwtService } from '@nestjs/jwt';
import { AiModule } from './ai/ai.module';
import { SharedModule } from './shared/shared.module';
import { RoleService } from '@permission/role/role.service';
import { MenuModule } from '@permission/menu/menu.module';
import { MenuService } from '@permission/menu/menu.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      synchronize: false,
      autoLoadEntities: true,
      logging: true,
    }),
    AuthModule,
    RoleModule,
    UserAccountModule,
    BookModule,
    AiModule,
    SharedModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserAccountService, JwtService, RoleService, MenuService],
})
export class AppModule {}
