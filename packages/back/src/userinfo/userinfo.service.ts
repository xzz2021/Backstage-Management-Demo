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

  async addUser(addUserinfoDto: AddUserinfoDto) {
    // const saltOrRounds = 10; // 数值越大速度越慢
    // createUserinfo.password = await bcrypt.hash(createUserinfo.password, saltOrRounds);
    // // const salt = await bcrypt.genSalt() // 用于生成salt
    // // 应该要先查询下用户名是否存在,  存在 抛出异常提示
    // const isExit = await this.prisma.user.findFirst({
    //   where: {
    //     phone: createUserinfo.phone
    //   }
    // });
    // if (isExit?.id && createUserinfo.phone) {
    //   return { code: 400, message: 'The phone number already exists' };
    // }
    // return
    // 创建注册用户信息  存储
    // try {
    //   const userSave = await this.prisma.user.create({
    //     data: createUserinfo,
    //     select: {
    //       id: true
    //     }
    //   });
    //   return userSave;
    // } catch (err) {
    //   //  错误  抛出异常
    //   const { code, sqlMessage } = err;
    //   return { code, message: sqlMessage };
    // }
  }

  update(addUserinfoDto: AddUserinfoDto) {
    return `This action updates a serinfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} userinfo`;
  }
}
