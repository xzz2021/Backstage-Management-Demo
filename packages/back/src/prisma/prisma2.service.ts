import { Injectable } from '@nestjs/common';

//  在只有连接一个数据库的 情况下，prisma会自动生成默认数据库类型的client, 放在@prisma/client目录
//
// import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from '@prisma/generated/pg/client';
import { PrismaClient } from '../../prisma/generated/pg/client';

// @Injectable()
// export class PrismaService
//   extends PrismaClient
//   implements OnModuleInit, OnModuleDestroy
// {
//   private readonly logger = new Logger(PrismaService.name);
//   async onModuleInit() {
//     let retries = 5;
//     while (retries > 0) {
//       try {
//         await this.$connect();

//         this.logger.log('Successfully connected to postgres database');

//         break;
//       } catch (err) {
//         this.logger.error(err);

//         this.logger.error(
//           `there was an error connecting to database, retrying .... (${retries})`,
//         );

//         retries -= 1;

//         await new Promise((res) => setTimeout(res, 3_000)); // wait for three seconds
//       }
//     }
//   }

//   async onModuleDestroy() {
//     await this.$disconnect();
//   }
// }

// 可选上面自定义的方案
@Injectable()
export class PrismaService extends PrismaClient {}
