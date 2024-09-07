import { Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';
// import { adminList } from './temp';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}
  async create(createRoleDto: CreateRoleDto) {
    const createStatement = {
      data: createRoleDto,
      select: { id: true }
    };
    try {
      const res = await this.prisma.role.create(createStatement);
      if (res?.id) {
        return res;
      }
    } catch (error) {
      console.log('🚀 ~ xzz: MenuService -> create -> error', error);
      return { code: 400, error: error.message };
    }
  }

  async findAll00() {
    try {
      // 1. 所有角色
      const res = (await this.prisma.role.findMany()) as any[];
      // 2. 单个 角色
      const newList = await Promise.all(
        res.map(async (item) => {
          let hashMap = {};
          const idArr = item.menu.map((menu) => {
            menu?.permission && (hashMap[menu.id] = menu.permission);
            return menu.id;
          });
          const getMenu = await this.prisma.menu.findMany({
            where: { id: { in: idArr } },
            include: {
              meta: true,
              permissionList: true
            }
          });
          getMenu.map((newNenu, index) => {
            const permission = hashMap[index];
            console.log('🚀 ~ xzz: findAll -> permission', permission);
            permission && (newNenu.meta.permission = permission);
          });
          item.menu = getMenu;
          console.log('🚀 ~ xzz: findAll -> item.menu', item.menu);
        })
      );
      console.log('🚀 ~ xzz: findAll -> res', res);
      return { list: res, total: res.length };
    } catch (error) {}
  }

  async findAll() {
    // 1. 获取的是 简要列表
    // 2. 详细菜单权限数据 转移到打开瞬间  根据id 查询
    try {
      const roles = await this.prisma.role.findMany({
        select: {
          id: true,
          name: true,
          remark: true,
          status: true,
          createdAt: true
        }
      });
      const total = await this.prisma.role.count();
      return { list: roles, total };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  //  ★★★★★★ 通过角色表信息 批量 查询对应的实际菜单和相应按钮权限 ★★★★★★
  async searchMenu(item) {
    const permissionMap = {};
    const menuIds = item.menu.map((menu) => {
      if (menu?.permission) {
        permissionMap[menu.id] = menu.permission;
      }
      return menu.id;
    });

    // Fetch menus with their meta and permissionList
    const menus = await this.prisma.menu.findMany({
      where: { id: { in: menuIds } },
      // include: { meta: true, permissionList: true }
      include: { meta: true }
    });

    // Update menu permissions
    menus.forEach((menu) => {
      const permission = permissionMap[menu.id];
      if (permission) {
        menu.meta.permission = permission;
      }
    });

    item.menu = menus;
    return item;
  }

  async findAllRole() {
    try {
      const roles = (await this.prisma.role.findMany()) as any[];
      const total = await this.prisma.role.count();
      return { list: roles, total };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async update(updateRoleDto: any) {
    const id = +updateRoleDto.id;
    delete updateRoleDto.id;
    const updateStatement = {
      where: { id },
      data: updateRoleDto
    };
    try {
      const res = await this.prisma.role.update(updateStatement);
      if (res?.id) return res;
    } catch (error) {
      console.log('🚀 ~ xzz:=======================e -> create -> error', error.message);
      return { code: 400, error: error.message };
    }
  }

  async getRoleMenu(user) {
    if (user.id === 1) {
      //  直接返回所有路由
      // return adminList;
      const res = await this.prisma.menu.findMany({
        include: {
          meta: true,
          permissionList: true
        }
      });
      return res;
    }
    if (user.curRoleId == null) {
      // 用户未分配角色
      return [];
    }
    //  获取到 角色 所拥有 的 路由
    const menuList = await this.getMenuById(+user.curRoleId);
    return menuList.menu;
  }

  async remove(id: number) {
    try {
      const res = await this.prisma.role.delete({
        where: { id },
        select: { id: true }
      });
      console.log('🚀 ~ xzz: MenuService -> remove -> res', res);
      if (res?.id) return res;
    } catch (error) {
      console.log('🚀 ~ xzz: MenuService -> create -> error', error);
      return { code: 400, error: error.message };
    }
  }

  async getMenuById(id: number) {
    // 根据角色id 获取相应 菜单 及权限数据
    try {
      // 1. 通过id查询到用户的角色信息
      // 2. 通过角色menu遍历获取真实数据
      const curRole = await this.prisma.role.findUnique({
        where: { id }
      });

      const newRole = await this.searchSingleMenu(curRole);
      return { menu: newRole };
    } catch (error) {
      console.log('🚀 ~ xzz: findDetailById -> error', error);
    }
  }

  async searchSingleMenu(roleItem) {
    const permissionMap = {};
    const itemWithId = roleItem.menu.filter((menu) => menu?.id);
    const menuIds = itemWithId.map((menu) => {
      if (menu?.permission) {
        permissionMap[menu.id] = menu.permission;
      }
      return menu.id;
    });

    // Fetch menus with their meta and permissionList
    const menus = await this.prisma.menu.findMany({
      where: { id: { in: menuIds } },
      // include: { meta: true, permissionList: true }
      include: { meta: true }
    });

    // Update menu permissions
    menus.forEach((menu) => {
      const permission = permissionMap[menu.id];
      menu.meta.permission = permission;
    });
    return menus;
  }

  async switchRole({ userId, curRoleId }) {
    // 1. 切换角色id
    // 2. 返回新路由
    try {
      const res = await this.prisma.user.update({
        where: { id: userId },
        data: { curRoleId }
      });
      if (res?.id) {
        const menuData = await this.getMenuById(curRoleId);
        return { id: res.id, menu: menuData.menu };
      }
    } catch (error) {
      console.log('🚀 ~ xzz: MenuService -> create -> error', error);
      return { code: 400, error: error.message };
    }
  }
}
