import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LinkStaffDto, AddRoleDto } from './dto/users.dto';
import { AppRole } from '@prisma/client';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfiles(pagination?: PaginationDto) {
    const include = {
      user: {
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      },
      staff: true,
    } as const;

    if (pagination?.page && pagination?.limit) {
      const { page, limit } = pagination;
      const [data, total] = await Promise.all([
        this.prisma.profile.findMany({
          include,
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.profile.count(),
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

    return this.prisma.profile.findMany({ include });
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        staff: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async linkStaff(dto: LinkStaffDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: dto.profileId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Verify the staff record exists
    const staff = await this.prisma.staff.findUnique({ where: { id: dto.staffId } });
    if (!staff) {
      throw new NotFoundException(`Staff with ID ${dto.staffId} not found`);
    }

    // Check if staff is already linked
    const existingLink = await this.prisma.profile.findUnique({
      where: { staffId: dto.staffId },
    });

    if (existingLink && existingLink.id !== dto.profileId) {
      throw new ConflictException('Staff is already linked to another profile');
    }

    return this.prisma.profile.update({
      where: { id: dto.profileId },
      data: { staffId: dto.staffId },
      include: {
        staff: true,
      },
    });
  }

  async getUsersWithRoles() {
    return this.prisma.user.findMany({
      include: {
        roles: true,
        profile: {
          include: {
            staff: true,
          },
        },
      },
    });
  }

  async addRole(userId: string, dto: AddRoleDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if role already exists
    const existingRole = await this.prisma.userRole.findUnique({
      where: {
        userId_role: {
          userId,
          role: dto.role as AppRole,
        },
      },
    });

    if (existingRole) {
      throw new ConflictException('User already has this role');
    }

    return this.prisma.userRole.create({
      data: {
        userId,
        role: dto.role as AppRole,
      },
    });
  }

  async removeRole(userId: string, role: string) {
    const userRole = await this.prisma.userRole.findUnique({
      where: {
        userId_role: {
          userId,
          role: role as AppRole,
        },
      },
    });

    if (!userRole) {
      throw new NotFoundException('Role not found for this user');
    }

    return this.prisma.userRole.delete({
      where: { id: userRole.id },
    });
  }
}
