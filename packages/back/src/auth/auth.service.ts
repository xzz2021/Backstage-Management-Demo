import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async signIn(user: any) {
    // const user = await this.prisma.user.findUnique({
    //   where: { phone: pho },
    //   include: {
    //     roles: true
    //   }
    // });
    // const isMatch = await bcrypt.compare(pwd, user.password);
    // if (!isMatch) throw new NotAcceptableException('用户名或密码错误');

    const { username, phone, curRoleId, avator, id, roles } = user;
    // console.log('🚀 ~ xzz: AuthService -> user', user);
    const curId = curRoleId || roles[0]?.roleId || 0;
    const payload = { id, username, phone, curRoleId: curId };
    const secretKey = process.env.JWT_SECRET;
    if(!secretKey) throw new Error('jwt secret key is not defined');
    
    // 登陆时 要给payload 定义好  默认的角色身份 curRoleId
    return {
      username,
      phone,
      avator,
      id,
      access_token: await this.jwtService.signAsync(payload, { secret :secretKey })
    };
  }

  async validateUser(phone: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { phone },
      include: {
        roles: true
      }
    });
    const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) throw new NotAcceptableException('用户名或密码错误');
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}

