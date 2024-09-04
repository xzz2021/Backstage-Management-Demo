import { Module } from '@nestjs/common';
import { PermissionListService } from './permissionList.service';
import { PermissionListController } from './permissionList.controller';

@Module({
  controllers: [PermissionListController],
  providers: [PermissionListService]
})
export class PermissionListModule {}
