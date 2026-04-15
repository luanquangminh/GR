import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OrganizationUnitsService } from './organization-units.service';
import { CreateOrganizationUnitDto, UpdateOrganizationUnitDto } from './dto/organization-units.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('organization-units')
@ApiBearerAuth()
@Controller('organization-units')
@UseGuards(JwtAuthGuard)
export class OrganizationUnitsController {
  constructor(private organizationUnitsService: OrganizationUnitsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all organization units (supports optional pagination)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (1-based). Omit for all results.' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (max 100). Omit for all results.' })
  @ApiResponse({ status: 200, description: 'List of all organization units' })
  findAll(@Query() pagination: PaginationDto) {
    return this.organizationUnitsService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization unit by ID' })
  @ApiResponse({ status: 200, description: 'Organization unit details' })
  @ApiResponse({ status: 404, description: 'Organization unit not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organizationUnitsService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create organization unit (admin only)' })
  @ApiResponse({ status: 201, description: 'Organization unit created' })
  create(@Body() dto: CreateOrganizationUnitDto) {
    return this.organizationUnitsService.create(dto);
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update organization unit (admin only)' })
  @ApiResponse({ status: 200, description: 'Organization unit updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrganizationUnitDto,
  ) {
    return this.organizationUnitsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete organization unit (admin only)' })
  @ApiResponse({ status: 200, description: 'Organization unit deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organizationUnitsService.remove(id);
  }
}
