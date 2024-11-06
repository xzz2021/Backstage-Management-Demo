import { Injectable } from '@nestjs/common';
import { PrismaService as SqlService  } from 'src/prisma/prisma.service';
import { PrismaService as PgService  } from 'src/prisma/prisma2.service';

@Injectable()
export class AppService {
  constructor(private prismaSql: SqlService,
    private prismaPg: PgService,
  ) {}
  async getHello(): Promise<any> {
    const aa = await this.prismaSql.user.findMany();
    const bb = await this.prismaPg.ir_config_parameter.findMany();
    return {aa,bb};
  }
}
