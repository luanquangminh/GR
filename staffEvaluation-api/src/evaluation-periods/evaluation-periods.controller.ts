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
import { EvaluationPeriodsService } from './evaluation-periods.service';
import { CreateEvaluationPeriodDto, UpdateEvaluationPeriodDto } from './dto/evaluation-periods.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('evaluation-periods')
@ApiBearerAuth()
@Controller('evaluation-periods')
@UseGuards(JwtAuthGuard)
export class EvaluationPeriodsController {
  constructor(private evaluationPeriodsService: EvaluationPeriodsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all evaluation periods (supports optional pagination)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (1-based). Omit for all results.' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (max 100). Omit for all results.' })
  @ApiResponse({ status: 200, description: 'List of evaluation periods' })
  findAll(@Query() pagination: PaginationDto) {
    return this.evaluationPeriodsService.findAll(pagination);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active evaluation periods' })
  @ApiResponse({ status: 200, description: 'List of active evaluation periods' })
  findActive() {
    return this.evaluationPeriodsService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get evaluation period by ID' })
  @ApiResponse({ status: 200, description: 'Evaluation period details' })
  @ApiResponse({ status: 404, description: 'Period not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationPeriodsService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create evaluation period (admin only)' })
  @ApiResponse({ status: 201, description: 'Period created' })
  create(@Body() dto: CreateEvaluationPeriodDto) {
    return this.evaluationPeriodsService.create(dto);
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update evaluation period (admin only)' })
  @ApiResponse({ status: 200, description: 'Period updated' })
  @ApiResponse({ status: 404, description: 'Period not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEvaluationPeriodDto) {
    return this.evaluationPeriodsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete evaluation period (admin only)' })
  @ApiResponse({ status: 200, description: 'Period deleted' })
  @ApiResponse({ status: 404, description: 'Period not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationPeriodsService.remove(id);
  }
}
