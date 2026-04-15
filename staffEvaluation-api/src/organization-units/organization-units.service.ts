import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateOrganizationUnitDto, UpdateOrganizationUnitDto } from './dto/organization-units.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class OrganizationUnitsService {
  private readonly logger = new Logger(OrganizationUnitsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(pagination?: PaginationDto) {
    if (pagination?.page && pagination?.limit) {
      const { page, limit } = pagination;
      const [data, total] = await Promise.all([
        this.prisma.organizationUnit.findMany({
          orderBy: { id: 'asc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.organizationUnit.count(),
      ]);

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      } satisfies PaginatedResult<typeof data[number]>;
    }

    return this.prisma.organizationUnit.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const unit = await this.prisma.organizationUnit.findUnique({
      where: { id },
    });

    if (!unit) {
      throw new NotFoundException(`Organization unit with ID ${id} not found`);
    }

    return unit;
  }

  async create(dto: CreateOrganizationUnitDto) {
    return this.prisma.organizationUnit.create({
      data: dto,
    });
  }

  async update(id: number, dto: UpdateOrganizationUnitDto) {
    const unit = await this.prisma.organizationUnit.findUnique({ where: { id } });

    if (!unit) {
      throw new NotFoundException(`Organization unit with ID ${id} not found`);
    }

    try {
      return await this.prisma.organizationUnit.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const fields = (error.meta?.target as string[])?.join(', ') || 'unknown field';
        throw new ConflictException(`Organization unit with duplicate ${fields} already exists`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    const unit = await this.prisma.organizationUnit.findUnique({ where: { id } });

    if (!unit) {
      throw new NotFoundException(`Organization unit with ID ${id} not found`);
    }

    const [staffCount, groupCount] = await Promise.all([
      this.prisma.staff.count({ where: { organizationunitid: id } }),
      this.prisma.group.count({ where: { organizationunitid: id } }),
    ]);

    if (staffCount > 0 || groupCount > 0) {
      this.logger.warn(
        `Deleting org unit "${unit.name}" (ID ${id}) — cascading ${staffCount} staff member(s), ${groupCount} group(s)`,
      );
    }

    return this.prisma.organizationUnit.delete({ where: { id } });
  }
}
