import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // @Post()
  // create(@Body() createRoleDto: CreateRoleDto) {
  //   return this.roleService.create(createRoleDto);
  // }

  @UseGuards(JwtAuthGuard) //  只有进过了AuthGuard 才能拿到token解析出的 用户信息
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

  @Get('getMenuById')
  findDetailById(@Query() param: { id: string }) {
    return this.roleService.getMenuById(+param?.id);
  }

  @Post('switchRole')
  // 切换角色
  switchRole(@Body() switchData: { id: number; curRoleId: number }) {
    const userId = +switchData.id;
    const curRoleId = +switchData.curRoleId;
    return this.roleService.switchRole({ userId, curRoleId });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
