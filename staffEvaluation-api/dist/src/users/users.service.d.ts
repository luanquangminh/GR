import { PrismaService } from '../prisma/prisma.service';
import { LinkStaffDto, AddRoleDto } from './dto/users.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfiles(): Promise<({
        staff: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            schoolEmail: string | null;
            staffcode: string;
            homeEmail: string | null;
            gender: import("@prisma/client").$Enums.Gender | null;
            birthday: Date | null;
            mobile: string | null;
            academicrank: string | null;
            academicdegree: string | null;
            position: string | null;
            isPartyMember: boolean;
            organizationunitid: number | null;
            bidv: string | null;
        } | null;
        user: {
            id: string;
            createdAt: Date;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        staffId: number | null;
    })[]>;
    getProfile(userId: string): Promise<{
        staff: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            schoolEmail: string | null;
            staffcode: string;
            homeEmail: string | null;
            gender: import("@prisma/client").$Enums.Gender | null;
            birthday: Date | null;
            mobile: string | null;
            academicrank: string | null;
            academicdegree: string | null;
            position: string | null;
            isPartyMember: boolean;
            organizationunitid: number | null;
            bidv: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        staffId: number | null;
    }>;
    linkStaff(dto: LinkStaffDto): Promise<{
        staff: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            schoolEmail: string | null;
            staffcode: string;
            homeEmail: string | null;
            gender: import("@prisma/client").$Enums.Gender | null;
            birthday: Date | null;
            mobile: string | null;
            academicrank: string | null;
            academicdegree: string | null;
            position: string | null;
            isPartyMember: boolean;
            organizationunitid: number | null;
            bidv: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        staffId: number | null;
    }>;
    getUsersWithRoles(): Promise<({
        profile: ({
            staff: {
                id: number;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                schoolEmail: string | null;
                staffcode: string;
                homeEmail: string | null;
                gender: import("@prisma/client").$Enums.Gender | null;
                birthday: Date | null;
                mobile: string | null;
                academicrank: string | null;
                academicdegree: string | null;
                position: string | null;
                isPartyMember: boolean;
                organizationunitid: number | null;
                bidv: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            staffId: number | null;
        }) | null;
        roles: {
            id: string;
            createdAt: Date;
            userId: string;
            role: import("@prisma/client").$Enums.AppRole;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        microsoftId: string | null;
        passwordHash: string | null;
        provider: string;
    })[]>;
    addRole(userId: string, dto: AddRoleDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        role: import("@prisma/client").$Enums.AppRole;
    }>;
    removeRole(userId: string, role: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        role: import("@prisma/client").$Enums.AppRole;
    }>;
}
