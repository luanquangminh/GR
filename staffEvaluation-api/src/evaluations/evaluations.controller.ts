import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { BulkEvaluationDto } from './dto/evaluations.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('evaluations')
@ApiBearerAuth()
@Controller('evaluations')
@UseGuards(JwtAuthGuard)
export class EvaluationsController {
  constructor(private evaluationsService: EvaluationsService) {}

  private ensureStaffLinked(user: JwtPayload & { id: string }): number {
    if (!user.staffId) {
      throw new ForbiddenException('User is not linked to a staff member. Please link your account to a staff profile first.');
    }
    return user.staffId;
  }

  @Get()
  @Roles('admin', 'moderator')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all evaluations (admin/moderator only)' })
  @ApiResponse({ status: 200, description: 'List of evaluations' })
  findAll(
    @Query('groupId') groupId?: string,
    @Query('reviewerId') reviewerId?: string,
    @Query('evaluateeId') evaluateeId?: string,
    @Query('periodId') periodId?: string,
  ) {
    return this.evaluationsService.findAll({
      groupId: groupId ? parseInt(groupId, 10) : undefined,
      reviewerId: reviewerId ? parseInt(reviewerId, 10) : undefined,
      evaluateeId: evaluateeId ? parseInt(evaluateeId, 10) : undefined,
      periodId: periodId ? parseInt(periodId, 10) : undefined,
    });
  }

  @Get('my')
  @ApiOperation({ summary: 'Get evaluations given by current user' })
  @ApiResponse({ status: 200, description: 'List of evaluations given' })
  @ApiResponse({ status: 403, description: 'User not linked to staff' })
  findMy(
    @CurrentUser() user: JwtPayload & { id: string },
    @Query('groupId') groupId?: string,
    @Query('periodId') periodId?: string,
  ) {
    const staffId = this.ensureStaffLinked(user);
    return this.evaluationsService.findByReviewer(
      staffId,
      groupId ? parseInt(groupId, 10) : undefined,
      periodId ? parseInt(periodId, 10) : undefined,
    );
  }

  @Get('received')
  @ApiOperation({ summary: 'Get evaluations received by current user' })
  @ApiResponse({ status: 200, description: 'List of evaluations received with reviewer info' })
  @ApiResponse({ status: 403, description: 'User not linked to staff' })
  findReceived(
    @CurrentUser() user: JwtPayload & { id: string },
    @Query('groupId') groupId?: string,
    @Query('periodId') periodId?: string,
  ) {
    const staffId = this.ensureStaffLinked(user);
    return this.evaluationsService.findByEvaluatee(
      staffId,
      groupId ? parseInt(groupId, 10) : undefined,
      periodId ? parseInt(periodId, 10) : undefined,
    );
  }

  @Get('my-groups')
  @ApiOperation({ summary: 'Get groups the current user belongs to' })
  @ApiResponse({ status: 200, description: 'List of groups' })
  @ApiResponse({ status: 403, description: 'User not linked to staff' })
  findMyGroups(@CurrentUser() user: JwtPayload & { id: string }) {
    const staffId = this.ensureStaffLinked(user);
    return this.evaluationsService.findGroupsByStaff(staffId);
  }

  @Get('colleagues/:groupId')
  @ApiOperation({ summary: 'Get colleagues in a group for evaluation' })
  @ApiResponse({ status: 200, description: 'List of colleagues' })
  @ApiResponse({ status: 403, description: 'User not linked to staff' })
  findColleagues(
    @Param('groupId', ParseIntPipe) groupId: number,
    @CurrentUser() user: JwtPayload & { id: string },
  ) {
    const staffId = this.ensureStaffLinked(user);
    return this.evaluationsService.findColleagues(groupId, staffId);
  }

  @Get('staff2groups')
  @Roles('admin', 'moderator')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get staff to groups mapping (admin/moderator only)' })
  @ApiResponse({ status: 200, description: 'Staff to groups mapping' })
  getStaff2Groups() {
    return this.evaluationsService.getStaff2Groups();
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Submit bulk evaluations for an active period' })
  @ApiResponse({ status: 201, description: 'Evaluations created/updated' })
  @ApiResponse({ status: 403, description: 'User not linked to staff' })
  bulkUpsert(@Body() dto: BulkEvaluationDto, @CurrentUser() user: JwtPayload & { id: string }) {
    const staffId = this.ensureStaffLinked(user);
    return this.evaluationsService.bulkUpsert(dto, staffId);
  }
}
