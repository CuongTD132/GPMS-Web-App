import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ProductionPlanComponent } from 'app/modules/admin/production-plan/production-plan.component';
import { ProductionPlanService } from './production-plan.service';

export default [
    {
        path: '',
        component: ProductionPlanComponent,
        resolve: {
            productionPlan: () =>
                inject(ProductionPlanService).getProductionPlans(),
        },
    },
] as Routes;
