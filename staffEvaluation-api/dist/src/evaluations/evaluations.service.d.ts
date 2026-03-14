import { PrismaService } from '../prisma/prisma.service';
import { BulkEvaluationDto } from './dto/evaluations.dto';
export declare class EvaluationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query?: {
        groupId?: number;
        reviewerId?: number;
        evaluateeId?: number;
        periodId?: number;
    }): Promise<({
        group: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationunitid: number | null;
        };
        question: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
        };
        reviewer: {
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
        evaluatee: {
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
        period: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            startDate: Date;
            endDate: Date;
            status: import("@prisma/client").$Enums.PeriodStatus;
        };
    } & {
        id: number;
        createdAt: Date;
        groupid: number;
        point: number;
        modifieddate: Date;
        reviewerid: number;
        evaluateeid: number;
        questionid: number;
        periodid: number;
    })[]>;
    findByReviewer(staffId: number, groupId?: number, periodId?: number): Promise<({
        question: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
        };
        evaluatee: {
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
        period: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            startDate: Date;
            endDate: Date;
            status: import("@prisma/client").$Enums.PeriodStatus;
        };
    } & {
        id: number;
        createdAt: Date;
        groupid: number;
        point: number;
        modifieddate: Date;
        reviewerid: number;
        evaluateeid: number;
        questionid: number;
        periodid: number;
    })[]>;
    findByEvaluatee(staffId: number, groupId?: number, periodId?: number): Promise<({
        group: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationunitid: number | null;
        };
        question: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
        };
        reviewer: {
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
        period: {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            startDate: Date;
            endDate: Date;
            status: import("@prisma/client").$Enums.PeriodStatus;
        };
    } & {
        id: number;
        createdAt: Date;
        groupid: number;
        point: number;
        modifieddate: Date;
        reviewerid: number;
        evaluateeid: number;
        questionid: number;
        periodid: number;
    })[]>;
    findGroupsByStaff(staffId: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationunitid: number | null;
    }[]>;
    findColleagues(groupId: number, myStaffId: number): Promise<{
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
    bulkUpsert(dto: BulkEvaluationDto, reviewerStaffId: number): Promise<{
        id: number;
        createdAt: Date;
        groupid: number;
        point: number;
        modifieddate: Date;
        reviewerid: number;
        evaluateeid: number;
        questionid: number;
        periodid: number;
    }[]>;
    getStaff2Groups(): Promise<({
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
    })[]>;
}
