import { Injectable } from '@nestjs/common';
import { CreatePermissionListDto, UpdatePermissionListDto } from './permissionList.dto';
import { PrismaService  } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionListService {
  constructor(private prisma: PrismaService) {}

  async create(createPermissionListDto: CreatePermissionListDto) {
    const { menuId, ...rest } = createPermissionListDto;
    const createStatement = {
      data: {
        ...rest,
        menu: { connect: { id: menuId } } // 连接menu表
      },
      select: { id: true }
    };
    try {
      const res = await this.prisma.permissionList.create(createStatement);
      console.log('🚀 ~ xzz: PermissionListService -> create -> res', res);
      if (res?.id) return res;
    } catch (error) {
      console.log('🚀 ~ xzz: MenuService -> create -> error', error);
      return { code: 400, error: error.message };
    }
  }

  findAll() {
    return `This action returns all permissionList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permissionList`;
  }

  async update(updatePermissionListDto: UpdatePermissionListDto) {
    const { id, ...rest } = updatePermissionListDto;
    const updateStatement = {
      where: { id },
      data: rest,
      select: { id: true }
    };
    try {
      const res = await this.prisma.permissionList.update(updateStatement);
      if (res?.id) return res;
    } catch (error) {
      console.log('🚀 ~ xzz:=======================e -> create -> error', error.message);
      return { code: 400, error: error.message };
    }
  }

  async remove(id: number) {
    try {
      const res = await this.prisma.permissionList.delete({
        where: { id },
        select: { id: true }
      });
      console.log('🚀 ~ xzz: MenuService -> remove -> res', res);
      if (res?.id) {
        return res;
      }
    } catch (error) {
      console.log('🚀 ~ xzz: MenuService -> create -> error', error);
      return { code: 400, error: error.message };
    }
  }
}
