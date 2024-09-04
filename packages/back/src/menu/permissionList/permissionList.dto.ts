import { PartialType } from '@nestjs/mapped-types';

// model PermissionList {
//     id          Int      @id @default(autoincrement())
//     label        String   @db.VarChar(50)
//     value        String   @db.VarChar(50)
//     deleted     Boolean  @default(false)
//     createdAt   DateTime @default(now())
//     updatedAt   DateTime @updatedAt
//     deleteAt    DateTime?
//     menu         Menu? @relation(fields: [menuId], references: [id]) //  多对一
//     menuId       Int?   //  关联外键
//   }
export class CreatePermissionListDto {
  nodeid: string;
  label: string;
  value: string;
  menuId: number;
}
export class UpdatePermissionListDto extends PartialType(CreatePermissionListDto) {
  id: number;
}
