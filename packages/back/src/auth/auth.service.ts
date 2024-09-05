import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async signIn(pho: string, pwd: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { phone: pho },
      include: {
        roles: true
      }
    });
    const isMatch = await bcrypt.compare(pwd, user.password);
    if (!isMatch) throw new NotFoundException('用户名或密码错误');

    const { username, phone, curRoleId, avator, id, roles } = user;
    console.log('🚀 ~ xzz: AuthService -> user', user);
    const curId = roles ? roles[0].roleId : curRoleId;
    const payload = { id, username, phone, curRoleId: curId };
    // const rawRoles = roles?.map((item) => {
    //   // return { id: item.role.id, name: item.role.name };
    //   const { id, name } = item.roleId;
    //   return { id, name };
    // });
    // 登陆时 要给payload 定义好  默认的角色身份 curRoleId
    return {
      username,
      phone,
      avator,
      id,
      access_token: this.jwtService.sign(payload)
    };
  }
}
