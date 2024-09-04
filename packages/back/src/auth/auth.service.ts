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
      where: { phone: pho }
    });
    const isMatch = await bcrypt.compare(pwd, user.password);
    if (!isMatch) throw new NotFoundException('用户名或密码错误');

    const { username, phone, roleId, id } = user;

    const payload = { id, username, phone, roleId };
    return {
      username,
      phone,
      roleId,
      id,
      access_token: this.jwtService.sign(payload)
    };
  }
}
