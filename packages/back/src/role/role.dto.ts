import { PartialType } from '@nestjs/mapped-types';
import { JsonArray } from '@prisma/client/runtime/library';
export class CreateRoleDto {
  name: string;
  menu: JsonArray | any[];
  remark?: string;
  status?: boolean;
}
export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  id: number;
}
