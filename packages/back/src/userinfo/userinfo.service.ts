import { Injectable } from '@nestjs/common';
import { AddUserinfoDto, CreateUserinfoDto, UpdateUserinfoDto } from './userinfo.dto';
// import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserinfoService {
  constructor(private prisma: PrismaService) {}
  async create(createUserinfo: CreateUserinfoDto) {
    const saltOrRounds = 10; // 数值越大速度越慢

    createUserinfo.password = await bcrypt.hash(createUserinfo.password, saltOrRounds);
    // const salt = await bcrypt.genSalt() // 用于生成salt

    // 应该要先查询下用户名是否存在,  存在 抛出异常提示
    const isExit = await this.prisma.user.findFirst({
      where: {
        phone: createUserinfo.phone
      }
    });
    if (isExit?.id && createUserinfo.phone) {
      return { code: 400, message: 'The phone number already exists' };
    }
    // return

    // 创建注册用户信息  存储
    try {
      const userSave = await this.prisma.user.create({
        data: createUserinfo,
        select: {
          id: true
        }
      });
      return userSave;
    } catch (err) {
      //  错误  抛出异常
      const { code, sqlMessage } = err;
      return { code, message: sqlMessage };
    }
  }

  async findAll(pageSize, pageIndex, searchParam) {
    const joinQueryParams = {
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        username: true,
        phone: true,
        avator: true
      }
    };
    try {
      const res = await this.prisma.user.findMany(joinQueryParams);
      const total = await this.prisma.user.count();
      return { list: res, total };
    } catch (error) {}
  }

  async findByDepartmentId(pageSize, pageIndex, departmentId, searchParam) {
    // 此处查询 只批量返回一般数据   查询效率会更好    详细数据应当通过单个ip去查询处理
    const joinQueryParams: any = {
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        username: true,
        phone: true,
        createdAt: true
      }
    };
    // 1. 查询该部门id 及 所有子部门id
    try {
      if (departmentId && departmentId != 1) {
        const ids = [];
        const subDepartmentIds = await this.prisma.department.findMany({
          where: { parentId: departmentId },
          select: { id: true }
        });
        ids.push(...subDepartmentIds.map((item) => item.id), departmentId);
        // 2.增加条件  属于当前部门的
        ids.length > 0 && (joinQueryParams.where = { departmentId: { in: ids } });
      }
      const res = await this.prisma.user.findMany(joinQueryParams);
      const total = await this.prisma.user.count();
      return { list: res, total };
    } catch (error) {
      console.log('🚀 ~ xzz: findByDepartmentId -> error', error);
    }
  }

  async findDetailById(id: number) {
    try {
      // 通过id查询到用户的角色和部门信息
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          roles: {
            include: {
              role: true
            }
          },
          department: true
        }
      });
      if (!user) {
        return { code: 404, message: 'User not found' };
      }
      // console.log('🚀 ~ xzz: findDetailById -> user', user);
      const { roles, department } = user;
      let newRoles = [];
      let newDepartment = {};
      if (roles.length > 0) {
        newRoles = roles?.map((item) => {
          // return { id: item.role.id, name: item.role.name };
          const { id, name } = item.role;
          return { id, name };
        });
      }
      if (department) {
        newDepartment = { id: department.id, name: department.name };
      }
      const result = { roles: newRoles, department: newDepartment };
      return result;
    } catch (error) {
      console.log('🚀 ~ xzz: findDetailById -> error', error);
    }
  }

  async addUser(addUserinfoDto: AddUserinfoDto) {
    console.log('🚀 ~ xzz: addUser -> addUserinfoDto', addUserinfoDto);
    const { departmentId, roles, phone, username } = addUserinfoDto;
    const saltOrRounds = 10; // 数值越大速度越慢
    try {
      //  直接新增用户 1. 默认密码123456
      const password = await bcrypt.hash('123456', saltOrRounds);

      // 2. 查询手机号 是否存在,  存在抛出异常提示
      const isExit = await this.prisma.user.findFirst({ where: { phone } });
      if (isExit?.id && phone) {
        return { code: 400, message: 'The phone number already exists' };
      }

      // //  3. 删除现有的角色数据
      // // await this.prisma.userRole.deleteMany({ where: { userId: id } });

      const userSave = await this.prisma.user.create({
        data: {
          username,
          password,
          phone,
          roles: {
            create: roles.map((item) => ({
              assignedBy: username,
              role: {
                connect: {
                  id: item
                }
              }
            }))
          },
          department: { connect: { id: departmentId } }
        },
        select: {
          id: true
        }
      });
      const id = userSave?.id;
      if (id) return userSave;
    } catch (error) {
      console.log(' ~ xzz: UserinfoService -> addUser -> error', error);
      return { code: 400, error: error.message };
    }
  }

  async update(updateUserinfoDto: UpdateUserinfoDto) {
    console.log('🚀 ~ xzz: addUser -> addUserinfoDto', updateUserinfoDto);
    const { id, departmentId, roles, phone, username } = updateUserinfoDto;
    try {
      //  修改用户信息

      //  1. 删除现有的角色数据
      const userSave = await this.prisma.$transaction(async (prisma) => {
        await prisma.userRole.deleteMany({ where: { userId: id } });
        await prisma.userRole.createMany({
          data: roles.map((item) => ({ assignedBy: username, userId: id, roleId: item }))
        });
        // roles.length > 0 && (await this.prisma.$executeRaw`DELETE FROM "_RoleToUser" WHERE "B" = ${id}`);

        const res = await prisma.user.update({
          where: { id },
          data: {
            username,
            phone,
            departmentId
          },
          select: {
            id: true
          }
        });
        return res;
      });
      console.log('🚀 ~ xzz: update -> userSave', userSave);
      return userSave;
      // const idx = userSave?.id;
      // if (idx) return userSave;
    } catch (error) {
      console.log(' ~ xzz: UserinfoService -> addUser -> error', error);
      return { code: 400, error: error.message };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} userinfo`;
  }
}
