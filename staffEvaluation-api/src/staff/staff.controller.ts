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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { AVATAR_ALLOWED_MIME, AVATAR_MAX_SIZE_BYTES } from '../common/upload.constants';

@ApiTags('staff')
@ApiBearerAuth()
@Controller('staff')
@UseGuards(JwtAuthGuard)
export class StaffController {
  private readonly logger = new Logger(StaffController.name);
  constructor(private staffService: StaffService) { }

  @Get()
  @ApiOperation({ summary: 'Get all staff members (supports optional pagination)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (1-based). Omit for all results.' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (max 100). Omit for all results.' })
  @ApiResponse({ status: 200, description: 'List of staff members with organization unit info' })
  findAll(@Query() pagination: PaginationDto) {
    return this.staffService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a staff member by ID' })
  @ApiResponse({ status: 200, description: 'Staff member details' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new staff member (admin only)' })
  @ApiResponse({ status: 201, description: 'Staff member created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() dto: CreateStaffDto) {
    return this.staffService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a staff member' })
  @ApiResponse({ status: 200, description: 'Staff member updated' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStaffDto,
    @CurrentUser() user: JwtPayload & { id: string },
  ) {
    return this.staffService.update(id, dto, user);
  }

  @Post(':id/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (_req, file, cb) => {
          const staffId = _req.params.id;
          const ext = extname(file.originalname).toLowerCase();
          cb(null, `${staffId}-${Date.now()}${ext}`);
        },
      }),
      limits: { fileSize: AVATAR_MAX_SIZE_BYTES },
      fileFilter: (_req, file, cb) => {
        if ((AVATAR_ALLOWED_MIME as readonly string[]).includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Chỉ chấp nhận file ảnh (JPG, PNG, WebP)'), false);
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload avatar for a staff member' })
  @ApiResponse({ status: 201, description: 'Avatar uploaded' })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  async uploadAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload & { id: string },
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file ảnh');
    }
    const avatarPath = `/uploads/avatars/${file.filename}`;
    try {
      const staff = await this.staffService.updateAvatar(id, avatarPath, user);
      return { avatarUrl: avatarPath, staff };
    } catch (error) {
      // Clean up orphaned file if auth or DB fails
      const fullPath = join(process.cwd(), 'uploads', 'avatars', file.filename);
      fs.promises.unlink(fullPath).catch(err =>
        this.logger.warn(`Failed to clean up orphaned avatar: ${err.message}`),
      );
      throw error;
    }
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a staff member (admin only)' })
  @ApiResponse({ status: 200, description: 'Staff member deleted' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.remove(id);
  }
}
