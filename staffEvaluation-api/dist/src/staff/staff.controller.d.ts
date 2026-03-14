import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
export declare class StaffController {
    private staffService;
    constructor(staffService: StaffService);
    findAll(): Promise<({
        organizationUnit: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        name: string;
        homeEmail: string | null;
        schoolEmail: string | null;
        staffcode: string;
        gender: import("@prisma/client").$Enums.Gender | null;
        birthday: Date | null;
        mobile: string | null;
        academicrank: string | null;
        academicdegree: string | null;
        position: string | null;
        isPartyMember: boolean;
        organizationunitid: number | null;
        bidv: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: number): Promise<{
        organizationUnit: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        staffGroups: ({
            group: {
                name: string;
                organizationunitid: number | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            staffid: number;
            groupid: number;
        })[];
    } & {
        name: string;
        homeEmail: string | null;
        schoolEmail: string | null;
        staffcode: string;
        gender: import("@prisma/client").$Enums.Gender | null;
        birthday: Date | null;
        mobile: string | null;
        academicrank: string | null;
        academicdegree: string | null;
        position: string | null;
        isPartyMember: boolean;
        organizationunitid: number | null;
        bidv: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateStaffDto): Promise<{
        organizationUnit: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        name: string;
        homeEmail: string | null;
        schoolEmail: string | null;
        staffcode: string;
        gender: import("@prisma/client").$Enums.Gender | null;
        birthday: Date | null;
        mobile: string | null;
        academicrank: string | null;
        academicdegree: string | null;
        position: string | null;
        isPartyMember: boolean;
        organizationunitid: number | null;
        bidv: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, dto: UpdateStaffDto, user: any): Promise<{
        organizationUnit: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        name: string;
        homeEmail: string | null;
        schoolEmail: string | null;
        staffcode: string;
        gender: import("@prisma/client").$Enums.Gender | null;
        birthday: Date | null;
        mobile: string | null;
        academicrank: string | null;
        academicdegree: string | null;
        position: string | null;
        isPartyMember: boolean;
        organizationunitid: number | null;
        bidv: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        name: string;
        homeEmail: string | null;
        schoolEmail: string | null;
        staffcode: string;
        gender: import("@prisma/client").$Enums.Gender | null;
        birthday: Date | null;
        mobile: string | null;
        academicrank: string | null;
        academicdegree: string | null;
        position: string | null;
        isPartyMember: boolean;
        organizationunitid: number | null;
        bidv: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
