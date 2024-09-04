import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './department.dto';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post('add')
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Post('update')
  update(@Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentService.update(updateDepartmentDto);
  }

  @Get('list')
  findBy(@Query() joinQueryParams: { [string: string]: any }) {
    const { pageSize = 10, pageIndex = 1, ...searchParam } = joinQueryParams;
    return this.departmentService.findBy(+pageSize, +pageIndex, searchParam);
  }

  @Get('alllist')
  findAll() {
    return this.departmentService.findAll();
  }

  // getRoletable2(@Query() joinQueryParams: {[string: string]: any}){
  //   const { pageSize = 10, pageIndex = 1, ...searchParam } = joinQueryParams
  //   return this.roleService.findAllRoles(pageSize,pageIndex, searchParam);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
  //   return this.departmentService.update(+id, updateDepartmentDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentService.remove(+id);
  }
}
