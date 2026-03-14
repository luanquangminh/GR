import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
export declare class StaffService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        organizationUnit: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
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
    })[]>;
    findOne(id: number): Promise<{
        organizationUnit: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        staffGroups: ({
            group: {
                id: number;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                organizationunitid: number | null;
            };
        } & {
            id: number;
            staffid: number;
            groupid: number;
        })[];
    } & {
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
    }>;
    create(dto: CreateStaffDto): Promise<{
        organizationUnit: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
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
    }>;
    update(id: number, dto: UpdateStaffDto, user: any): Promise<{
        organizationUnit: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
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
    }>;
    remove(id: number): Promise<{
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
    }>;
}
