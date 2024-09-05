import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';
import { AuthGuard } from 'src/allProcessor/guard/auth.guard';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // @Post()
  // create(@Body() createRoleDto: CreateRoleDto) {
  //   return this.roleService.create(createRoleDto);
  // }

  @UseGuards(AuthGuard) //  只有进过了AuthGuard 才能拿到token解析出的 用户信息
  @Get('getRoleMenu')
  roleMenu(@Req() req: any) {
    const user = req.user;
    return this.roleService.getRoleMenu(user);
  }

  @Post('add')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Post('update')
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(updateRoleDto);
  }

  // 带有权限的列表
  @Get('list')
  findAll() {
    return this.roleService.findAll();
  }

  @Get('rolelist')
  findAllRole() {
    return this.roleService.findAllRole();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
