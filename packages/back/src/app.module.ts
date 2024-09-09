import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserinfoModule } from './userinfo/userinfo.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
// 测试
// import { PrismaModule } from './prisma/prisma.module';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import { PermissionListModule } from './menu/permissionList/permissionList.module';
import { DepartmentModule } from './department/department.module';
@Module({
  imports: [
    UserinfoModule,
    PermissionListModule,
    PrismaModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    RoleModule,
    MenuModule,
    DepartmentModule
  ],
  controllers: [AppController],
  providers: [
    AppService
    // {
    //   //  全局注册 JWT token守卫    jwt一定要放在角色之前  因为要解析到 用户   才能拿到 角色
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard
    // }
  ]
})
export class AppModule {}
