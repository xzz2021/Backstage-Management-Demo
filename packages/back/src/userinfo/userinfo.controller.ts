import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { UserinfoService } from './userinfo.service';
import { AddUserinfoDto, CreateUserinfoDto, ResetPwdDto, UpdateUserinfoDto } from './userinfo.dto';

@Controller('user')
export class UserinfoController {
  constructor(private readonly userinfoService: UserinfoService) {}

  @Post('register')
  create(@Body() createUserinfo: CreateUserinfoDto) {
    return this.userinfoService.create(createUserinfo);
  }

  @Get('list')
  findAll(@Query() joinQueryParams: { [string: string]: any }) {
    const { pageSize = 10, pageIndex = 1, ...searchParam } = joinQueryParams;
    return this.userinfoService.findAll(+pageSize, +pageIndex, searchParam);
  }

  @Get('listByDepartmentId')
  findBy(@Query() joinQueryParams: { [string: string]: any }) {
    const { pageSize = 10, pageIndex = 1, id, ...searchParam } = joinQueryParams;
    return this.userinfoService.findByDepartmentId(+pageSize, +pageIndex, +id, searchParam);
  }

  @Get('detailById')
  findDetailById(@Query() param: { id: string }) {
    return this.userinfoService.findDetailById(+param?.id);
  }

  @Get('personById')
  //  根据id获取用户个人中心信息  及角色数组
  findPersonById(@Query() param: { id: string }) {
    return this.userinfoService.findPersonById(+param?.id);
  }

  @Post('add')
  addUser(@Body() addUserinfoDto: AddUserinfoDto) {
    return this.userinfoService.addUser(addUserinfoDto);
  }

  @Post('update')
  update(@Body() updateUserinfoDto: UpdateUserinfoDto) {
    return this.userinfoService.update(updateUserinfoDto);
  }

  @Post('resetPassword')
  resetPassword(@Body() resetPwdDto: ResetPwdDto) {
    return this.userinfoService.resetPassword(resetPwdDto);
  }

  @Post('updateInfo')
  updateInfo(@Body() updateUserinfoDto: UpdateUserinfoDto, @Req() req: any) {
    const user = req.user;
    return this.userinfoService.updateInfo(updateUserinfoDto, user.id);
  }


  @Post('updatePwd')
  updatePwd(@Body() updateUserinfoDto: UpdateUserinfoDto, @Req() req: any) {
    const user = req.user;
    return this.userinfoService.updatePwd(updateUserinfoDto, user.id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userinfoService.remove(+id);
  }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateUserinfoDto: UpdateUserinfoDto) {
  //     return this.userinfoService.update(+id, updateUserinfoDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.userinfoService.remove(+id);
  //   }
}
