import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto, UpdateDepartmentDto } from './department.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async create(createDepartmentDto: any) {
    const createStatement = {
      data: createDepartmentDto,
      select: { id: true }
    };
    try {
      const res = await this.prisma.department.create(createStatement);
      if (res?.id) return res;
    } catch (error) {
      console.log('🚀 ~ xzz: DepartmentService -> create -> error', error);
      return { code: 400, error: error.message };
    }
  }

  async findBy(pageSize, pageIndex, searchParam) {
    const joinQueryParams = {
      skip: (pageIndex - 1) * pageSize,
      take: pageSize
    };
    try {
      const res = await this.prisma.department.findMany(joinQueryParams);
      const total = await this.prisma.department.count();
      return { list: res, total };
    } catch (error) {}
  }

  async findAll() {
    try {
      const res = await this.prisma.department.findMany();
      const total = await this.prisma.department.count();
      return { list: res, total };
    } catch (error) {}
  }

  async update(updateDepartmentDto: any) {
    const id = updateDepartmentDto.id;
    const updateStatement = {
      where: { id },
      data: updateDepartmentDto
    };
    try {
      const res = await this.prisma.department.update(updateStatement);
      if (res?.id) return res;
    } catch (error) {
      console.log('🚀 ~ xzz:=======================e -> create -> error', error.message);
      return { code: 400, error: error.message };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} department`;
  }

  async remove(id: number) {
    try {
      const res = await this.prisma.department.delete({
        where: { id },
        select: { id: true }
      });
      if (res?.id) return res;
    } catch (error) {
      console.log('🚀 ~ xzz: DepartmentService -> create -> error', error);
      return { code: 400, error: error.message };
    }
  }
}
