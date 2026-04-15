import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto, UpdateGroupDto, UpdateGroupMembersDto } from './dto/groups.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('groups')
@ApiBearerAuth()
@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private groupsService: GroupsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all groups (supports optional pagination)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (1-based). Omit for all results.' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (max 100). Omit for all results.' })
  @ApiResponse({ status: 200, description: 'List of groups with organization unit info' })
  findAll(@Query() pagination: PaginationDto) {
    return this.groupsService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a group by ID' })
  @ApiResponse({ status: 200, description: 'Group details' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.findOne(id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get members of a group' })
  @ApiResponse({ status: 200, description: 'List of staff members in the group' })
  getMembers(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.getMembers(id);
  }

  @Post()
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new group (admin only)' })
  @ApiResponse({ status: 201, description: 'Group created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() dto: CreateGroupDto) {
    return this.groupsService.create(dto);
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a group (admin only)' })
  @ApiResponse({ status: 200, description: 'Group updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGroupDto) {
    return this.groupsService.update(id, dto);
  }

  @Put(':id/members')
  @Roles('admin', 'moderator')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Set group members (admin/moderator)' })
  @ApiResponse({ status: 200, description: 'Group members updated' })
  updateMembers(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGroupMembersDto,
  ) {
    return this.groupsService.updateMembers(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a group (admin only)' })
  @ApiResponse({ status: 200, description: 'Group deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.remove(id);
  }
}
