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
    try {
      // 1. Fetch all roles
      const roles = (await this.prisma.role.findMany()) as any[];

      // 2. Process each role
      const updatedRoles = await Promise.all(
        roles.map(async (role) => {
          return await this.searchMenu(role);
        })
      );

      return { list: updatedRoles, total: updatedRoles.length };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  //  通过角色表信息 查询对应的实际菜单和相应按钮权限
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
      include: { meta: true, permissionList: true }
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
      // 1. Fetch all roles
      const roles = (await this.prisma.role.findMany()) as any[];

      const total = await this.prisma.role.count();

      return { list: roles, total };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async update(updateRoleDto: any) {
    const id = updateRoleDto.id;
    delete updateRoleDto.id;
    console.log('🚀 ~ xzz: update -> updateRoleDto.id', updateRoleDto);
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
    if (user.roleId == null) {
      // 用户未分配角色
      return [];
    }
    //  获取到 角色 所拥有 的 路由
    const menuList = await this.getMenuByRole(user.roleId);
    return menuList;
  }

  async getMenuByRole(roleId) {
    if (!roleId) return [];
    // 获取权限路由id关联菜单表的json数据
    const roleData = await this.prisma.role.findUnique({
      where: { id: roleId },
      select: { menu: true }
    });
    return [];
    // const roleMenu = JSON.parse(roleData.menu) as rawMenuType[];
    // console.log('🚀 ~ xzz: RoleService -> getMenuByRole -> roleMenu', roleMenu);
    // // roleMenu 是json数据   [{menuid: 5, permission: ['edit']}, {menuid: 6, permission: ['add']}]]
    // // const idValues = JSON.parse(roleMenu.menu).map((item) => item.menuid);
    // const idValues = roleMenu.map((item) => item.menuid);
    // const rawMenu = await this.prisma.menu.findMany({
    //   where: {
    //     id: { in: idValues }
    //   }
    // });
    // const menuList = rawMenu.map((item) => {
    //   roleMenu;
    // });

    // return menuList;

    // return roleMenu || [];
  }

  // update(id: number, updateRoleDto: UpdateRoleDto) {
  //   return `This action updates a #${id} role`;
  // }

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
}
