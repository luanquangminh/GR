import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto, UpdateGroupDto, UpdateGroupMembersDto } from './dto/groups.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);

  constructor(private prisma: PrismaService) { }

  async findAll(pagination?: PaginationDto) {
    if (pagination?.page && pagination?.limit) {
      const { page, limit } = pagination;
      const [data, total] = await Promise.all([
        this.prisma.group.findMany({
          orderBy: { id: 'asc' },
          include: { organizationUnit: true },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.group.count(),
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

    return this.prisma.group.findMany({
      orderBy: { id: 'asc' },
      include: {
        organizationUnit: true,
      },
    });
  }

  async findOne(id: number) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        organizationUnit: true,
        staffGroups: {
          include: {
            staff: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return group;
  }

  async getMembers(id: number) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        staffGroups: {
          include: {
            staff: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return group.staffGroups.map((sg) => sg.staff);
  }

  async create(dto: CreateGroupDto) {
    return this.prisma.group.create({
      data: dto,
      include: {
        organizationUnit: true,
      },
    });
  }

  async update(id: number, dto: UpdateGroupDto) {
    const group = await this.prisma.group.findUnique({ where: { id } });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return this.prisma.group.update({
      where: { id },
      data: dto,
      include: {
        organizationUnit: true,
      },
    });
  }

  async updateMembers(id: number, dto: UpdateGroupMembersDto) {
    const group = await this.prisma.group.findUnique({ where: { id } });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    // Deduplicate and verify all staff IDs exist
    const uniqueIds = [...new Set(dto.staffIds)];

    if (uniqueIds.length > 0) {
      const existingStaff = await this.prisma.staff.findMany({
        where: { id: { in: uniqueIds } },
        select: { id: true },
      });
      const existingIds = new Set(existingStaff.map(s => s.id));
      const invalidIds = uniqueIds.filter(id => !existingIds.has(id));
      if (invalidIds.length > 0) {
        throw new BadRequestException(`Staff IDs not found: ${invalidIds.join(', ')}`);
      }
    }

    // Atomic: delete old members and add new ones in a single transaction
    await this.prisma.$transaction(async (tx) => {
      await tx.staff2Group.deleteMany({
        where: { groupid: id },
      });

      if (uniqueIds.length > 0) {
        await tx.staff2Group.createMany({
          data: uniqueIds.map((staffid) => ({
            staffid,
            groupid: id,
          })),
        });
      }
    });

    return this.getMembers(id);
  }

  async remove(id: number) {
    const group = await this.prisma.group.findUnique({ where: { id } });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    const [memberCount, evalCount] = await Promise.all([
      this.prisma.staff2Group.count({ where: { groupid: id } }),
      this.prisma.evaluation.count({ where: { groupid: id } }),
    ]);

    if (memberCount > 0 || evalCount > 0) {
      this.logger.warn(
        `Deleting group "${group.name}" (ID ${id}) — cascading ${memberCount} member(s), ${evalCount} evaluation(s)`,
      );
    }

    return this.prisma.group.delete({ where: { id } });
  }
}
