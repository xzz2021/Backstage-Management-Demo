import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionListService } from './permissionList.service';
import { CreatePermissionListDto, UpdatePermissionListDto } from './permissionList.dto';

@Controller('permissionList')
export class PermissionListController {
  constructor(private readonly permissionListService: PermissionListService) {}

  @Post('add')
  create(@Body() createPermissionListDto: CreatePermissionListDto) {
    return this.permissionListService.create(createPermissionListDto);
  }

  @Post('update')
  update(@Body() updatePermissionListDto: UpdatePermissionListDto) {
    return this.permissionListService.update(updatePermissionListDto);
  }

  @Get()
  findAll() {
    return this.permissionListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionListService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePermissionListDto: UpdatePermissionListDto) {
  //   return this.permissionListService.update(+id, updatePermissionListDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionListService.remove(+id); //  +id时为了将数字id转换为string
  }
}
