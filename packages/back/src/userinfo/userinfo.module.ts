import { Module } from '@nestjs/common';
import { UserinfoService } from './userinfo.service';
import { UserinfoController } from './userinfo.controller';
// import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [],
  controllers: [UserinfoController],
  providers: [UserinfoService]
})
export class UserinfoModule {}
