
import { Global, Module } from '@nestjs/common';
import { PrismaService as MysqlService } from './prisma.service';
import { PrismaService as PgService } from './prisma2.service';

@Global()   // 注册为全局 模块
@Module({
  providers: [MysqlService, PgService],
  exports: [MysqlService, PgService],
})
export class PrismaModule {}
