import { Gender } from '@prisma/client';
export declare class CreateStaffDto {
    name: string;
    homeEmail?: string;
    schoolEmail?: string;
    staffcode: string;
    gender?: Gender;
    birthday?: string;
    mobile?: string;
    academicrank?: string;
    academicdegree?: string;
    position?: string;
    isPartyMember?: boolean;
    organizationunitid?: number;
    bidv?: string;
}
declare const UpdateStaffDto_base: import("@nestjs/common").Type<Partial<CreateStaffDto>>;
export declare class UpdateStaffDto extends UpdateStaffDto_base {
}
export {};
