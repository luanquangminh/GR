import { GroupsService } from './groups.service';
import { CreateGroupDto, UpdateGroupDto, UpdateGroupMembersDto } from './dto/groups.dto';
export declare class GroupsController {
    private groupsService;
    constructor(groupsService: GroupsService);
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
        organizationunitid: number | null;
    })[]>;
    findOne(id: number): Promise<{
        organizationUnit: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        staffGroups: ({
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
        organizationunitid: number | null;
    }>;
    getMembers(id: number): Promise<{
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
    }[]>;
    create(dto: CreateGroupDto): Promise<{
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
        organizationunitid: number | null;
    }>;
    update(id: number, dto: UpdateGroupDto): Promise<{
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
        organizationunitid: number | null;
    }>;
    updateMembers(id: number, dto: UpdateGroupMembersDto): Promise<{
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
    }[]>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationunitid: number | null;
    }>;
}
