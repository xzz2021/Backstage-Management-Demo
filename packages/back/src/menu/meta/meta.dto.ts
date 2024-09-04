import { PartialType } from '@nestjs/mapped-types';

export class CreateMetaDto {
  path?: string;
  redirect?: string;
  affix?: string;
  title?: string;
  icon?: string;
  activeMenu?: boolean;
  alwaysShow?: boolean;
  breadcrumb?: boolean;
  canTo?: boolean;
  hidden?: boolean;
  noCache?: boolean;
  noTagsView?: boolean;
  permission?: string[];
}
export class UpdateMetaDto extends PartialType(CreateMetaDto) {
  id: number;
  menuId: number;
}
