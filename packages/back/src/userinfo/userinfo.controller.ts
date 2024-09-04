import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserinfoService } from './userinfo.service';
import { AddUserinfoDto, CreateUserinfoDto, UpdateUserinfoDto } from './userinfo.dto';

@Controller('userinfo')
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

  @Post('add')
  addUser(@Body() addUserinfoDto: AddUserinfoDto) {
    return this.userinfoService.addUser(addUserinfoDto);
  }

  @Post('update')
  update(@Body() addUserinfoDto: AddUserinfoDto) {
    return this.userinfoService.update(addUserinfoDto);
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
