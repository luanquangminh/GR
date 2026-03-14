import { EvaluationsService } from './evaluations.service';
import { BulkEvaluationDto } from './dto/evaluations.dto';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class EvaluationsController {
    private evaluationsService;
    constructor(evaluationsService: EvaluationsService);
    private ensureStaffLinked;
    findAll(groupId?: string, reviewerId?: string, evaluateeId?: string, periodId?: string): Promise<({
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
    findMy(user: JwtPayload & {
        id: string;
    }, groupId?: string, periodId?: string): Promise<({
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
    findReceived(user: JwtPayload & {
        id: string;
    }, groupId?: string, periodId?: string): Promise<({
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
    findMyGroups(user: JwtPayload & {
        id: string;
    }): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationunitid: number | null;
    }[]>;
    findColleagues(groupId: number, user: JwtPayload & {
        id: string;
    }): Promise<{
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
    bulkUpsert(dto: BulkEvaluationDto, user: JwtPayload & {
        id: string;
    }): Promise<{
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
}
