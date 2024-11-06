import { Injectable } from '@nestjs/common';
import { CreateMenuDto, UpdateMenuDto } from './menu.dto';
import { PrismaService  } from 'src/prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuDto: any) {
    delete createMenuDto.permissionList;
    const createStatement = {
      data: {
        ...createMenuDto,
        meta: {
          create: createMenuDto.meta
        }
      },
      select: { id: true }
    };
    try {
      const res = await this.prisma.menu.create(createStatement);
      if (res?.id) {
        return res;
      }
    } catch (error) {
      console.log('🚀 ~ xzz: MenuService -> create -> error', error);
      return { code: 400, error: error.message };
    }
  }

  async create00(createMenuDto: any) {
    //  关联处理 外表
    const { permissionList } = createMenuDto;
    const createStatement = {
      data: {
        ...createMenuDto,
        meta: {
          create: createMenuDto.meta
        },
        permissionList: {
          create: permissionList?.length > 0 ? permissionList : undefined
        }
      },
      select: { id: true }
    };
    try {
      const res = await this.prisma.menu.create(createStatement);
      if (res?.id) {
        return res;
      }
    } catch (error) {
      console.log('🚀 ~ xzz: MenuService -> create -> error', error);
      return { code: 400, error: error.message };
    }
  }

  async findAll() {
    const findModule = {
      // 为什么要select  因为要排除数据库自增id  否则???
      include: {
        meta: true,
        permissionList: true
      }
    };
    try {
      const res = await this.prisma.menu.findMany(findModule);
      const total = await this.prisma.menu.count();
      return { list: res, total };
    } catch (error) {}
  }

  async update(updateMenuDto: any) {
    const id = updateMenuDto.id;
    delete updateMenuDto.permissionList;
    delete updateMenuDto?.meta?.id;
    delete updateMenuDto?.meta?.menuId;
    // delete updateMenuDto.id;
    const updateStatement = {
      where: { id },
      data: {
        ...updateMenuDto,
        meta: {
          update: updateMenuDto.meta
        }
      }
    };
    try {
      const res = await this.prisma.menu.update(updateStatement);
      if (res?.id) {
        return { id: res.id };
      }
    } catch (error) {
      console.log('🚀 ~ xzz:=======================e -> create -> error', error.message);
      return { code: 400, error: error.message };
    }
  }

  //  因为permissionList的操作涉及单独crud 会影响整体数据 增加复杂性
  //  所以 还是 单独 处理比较好  menu只处理menu和meta数据
  async update22(updateMenuDto: any) {
    const perList = JSON.parse(JSON.stringify(updateMenuDto.permissionList));
    delete updateMenuDto.permissionList;
    const updateStatement = {
      where: { id: updateMenuDto.id },
      data: {
        ...updateMenuDto,
        meta: {
          update: updateMenuDto.meta
        }
      }
    };

    try {
      const res = await this.prisma.$transaction(
        async (prisma) => {
          const res1 = await prisma.menu.update(updateStatement);
          if (perList.length > 0) {
            await this.upsertPermission(updateMenuDto.id, perList, prisma);
            return res1;
          } else {
            return res1;
          }
        },
        { timeout: 10000 }
      );
      if (res?.id) {
        return { id: res.id };
      }
    } catch (error) {
      console.log('🚀 ~ xzz:=======================e -> create -> error', error.message);
      return { code: 400, error: error.message };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  // update(id: number, updateMenuDto: UpdateMenuDto) {
  //   return `This action updates a #${id} menu`;
  // }

  async remove(id: number) {
    try {
      const res = await this.prisma.menu.delete({
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

  async upsertPermission(
    menuId: number,
    permissionList: { id?: number; nodeid?: number; label: string; value: string }[],
    prisma
  ) {
    const upsertPromises = permissionList.map((item) =>
      prisma.permissionList.upsert({
        where: { id: item.id || 0 },
        update: {
          label: item.label,
          value: item.value,
          nodeid: item.nodeid
        },
        create: {
          label: item.label,
          value: item.value,
          nodeid: item.nodeid,
          menuId //  聪明,  反向思维 进行创建 关联数据
        }
      })
    );

    return await Promise.all(upsertPromises);
  }
}
