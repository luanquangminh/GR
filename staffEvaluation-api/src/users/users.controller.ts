import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { LinkStaffDto, AddRoleDto } from './dto/users.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/strategies/jwt.strategy';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get('profiles')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all user profiles (supports optional pagination)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (1-based). Omit for all results.' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (max 100). Omit for all results.' })
  @ApiResponse({ status: 200, description: 'List of all user profiles with staff info' })
  getProfiles(@Query() pagination: PaginationDto) {
    return this.usersService.getProfiles(pagination);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile with staff and roles' })
  getMyProfile(@CurrentUser() user: JwtPayload & { id: string }) {
    return this.usersService.getProfile(user.id);
  }

  @Post('link-staff')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Link a user profile to a staff member (admin only)' })
  @ApiResponse({ status: 201, description: 'Profile linked to staff' })
  @ApiResponse({ status: 400, description: 'Invalid profile or staff ID' })
  linkStaff(@Body() dto: LinkStaffDto) {
    return this.usersService.linkStaff(dto);
  }

  @Get('roles')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all users with their roles (admin only)' })
  @ApiResponse({ status: 200, description: 'List of users with roles' })
  getUsersWithRoles() {
    return this.usersService.getUsersWithRoles();
  }

  @Post(':userId/roles')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Add a role to a user (admin only)' })
  @ApiResponse({ status: 201, description: 'Role added' })
  @ApiResponse({ status: 404, description: 'User not found' })
  addRole(@Param('userId') userId: string, @Body() dto: AddRoleDto) {
    return this.usersService.addRole(userId, dto);
  }

  @Delete(':userId/roles/:role')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Remove a role from a user (admin only)' })
  @ApiResponse({ status: 200, description: 'Role removed' })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  removeRole(@Param('userId') userId: string, @Param('role') role: string) {
    return this.usersService.removeRole(userId, role);
  }
}
