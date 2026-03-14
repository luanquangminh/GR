import { OrganizationUnitsService } from './organization-units.service';
import { CreateOrganizationUnitDto, UpdateOrganizationUnitDto } from './dto/organization-units.dto';
export declare class OrganizationUnitsController {
    private organizationUnitsService;
    constructor(organizationUnitsService: OrganizationUnitsService);
    findAll(): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateOrganizationUnitDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, dto: UpdateOrganizationUnitDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
