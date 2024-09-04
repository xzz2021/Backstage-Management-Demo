import { PartialType } from '@nestjs/mapped-types';
import { CreateMetaDto, UpdateMetaDto } from './meta/meta.dto';
import { CreatePermissionListDto } from './permissionList/permissionList.dto';

export class CreateMenuDto {
  name: string;
  path: string;
  redirect?: string;
  component: string;
  title?: string;
  sort?: number;
  parentId?: number;
  meta: Partial<CreateMetaDto>;
  permissionList?: CreatePermissionListDto[];
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  id: number;
  parentId?: number;
  meta?: Partial<UpdateMetaDto>;
}
