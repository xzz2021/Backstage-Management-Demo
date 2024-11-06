import { Injectable } from '@nestjs/common';
import { CreateMetaDto, UpdateMetaDto } from './meta.dto';
import { PrismaService  } from 'src/prisma/prisma.service';

@Injectable()
export class MetaService {
  constructor(private prisma: PrismaService) {}

  create(createMetaDto: CreateMetaDto) {
    return 'This action adds a new meta';
  }

  findAll() {
    return `This action returns all meta`;
  }

  findOne(id: number) {
    return `This action returns a #${id} meta`;
  }

  update(id: number, updateMetaDto: UpdateMetaDto) {
    return `This action updates a #${id} meta`;
  }

  remove(id: number) {
    return `This action removes a #${id} meta`;
  }
}
