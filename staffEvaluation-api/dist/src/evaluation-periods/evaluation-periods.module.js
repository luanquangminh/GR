"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationPeriodsModule = void 0;
const common_1 = require("@nestjs/common");
const evaluation_periods_service_1 = require("./evaluation-periods.service");
const evaluation_periods_controller_1 = require("./evaluation-periods.controller");
let EvaluationPeriodsModule = class EvaluationPeriodsModule {
};
exports.EvaluationPeriodsModule = EvaluationPeriodsModule;
exports.EvaluationPeriodsModule = EvaluationPeriodsModule = __decorate([
    (0, common_1.Module)({
        controllers: [evaluation_periods_controller_1.EvaluationPeriodsController],
        providers: [evaluation_periods_service_1.EvaluationPeriodsService],
        exports: [evaluation_periods_service_1.EvaluationPeriodsService],
    })
], EvaluationPeriodsModule);
//# sourceMappingURL=evaluation-periods.module.js.map