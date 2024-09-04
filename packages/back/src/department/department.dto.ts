import { PartialType } from '@nestjs/mapped-types';

export class CreateDepartmentDto {}
export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
