import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@permission/auth/auth.module';
import { RoleModule } from '@permission/role/role.module';
import { BookModule } from '@book/book.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserService } from '@user/services/user.service';
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
    UserModule,
    BookModule,
    AiModule,
    SharedModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService, JwtService, RoleService, MenuService],
})
export class AppModule {}
