"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationPeriodsController = void 0;
const common_1 = require("@nestjs/common");
const evaluation_periods_service_1 = require("./evaluation-periods.service");
const evaluation_periods_dto_1 = require("./dto/evaluation-periods.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let EvaluationPeriodsController = class EvaluationPeriodsController {
    evaluationPeriodsService;
    constructor(evaluationPeriodsService) {
        this.evaluationPeriodsService = evaluationPeriodsService;
    }
    findAll() {
        return this.evaluationPeriodsService.findAll();
    }
    findActive() {
        return this.evaluationPeriodsService.findActive();
    }
    findOne(id) {
        return this.evaluationPeriodsService.findOne(id);
    }
    create(dto) {
        return this.evaluationPeriodsService.create(dto);
    }
    update(id, dto) {
        return this.evaluationPeriodsService.update(id, dto);
    }
    remove(id) {
        return this.evaluationPeriodsService.remove(id);
    }
};
exports.EvaluationPeriodsController = EvaluationPeriodsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all evaluation periods' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of evaluation periods' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EvaluationPeriodsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active evaluation periods' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of active evaluation periods' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EvaluationPeriodsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get evaluation period by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Evaluation period details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Period not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EvaluationPeriodsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create evaluation period (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Period created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [evaluation_periods_dto_1.CreateEvaluationPeriodDto]),
    __metadata("design:returntype", void 0)
], EvaluationPeriodsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update evaluation period (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Period updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Period not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, evaluation_periods_dto_1.UpdateEvaluationPeriodDto]),
    __metadata("design:returntype", void 0)
], EvaluationPeriodsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete evaluation period (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Period deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Period not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EvaluationPeriodsController.prototype, "remove", null);
exports.EvaluationPeriodsController = EvaluationPeriodsController = __decorate([
    (0, swagger_1.ApiTags)('evaluation-periods'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('evaluation-periods'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [evaluation_periods_service_1.EvaluationPeriodsService])
], EvaluationPeriodsController);
//# sourceMappingURL=evaluation-periods.controller.js.map