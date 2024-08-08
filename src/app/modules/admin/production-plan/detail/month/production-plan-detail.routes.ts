import { inject } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { ProductionPlanComponent } from 'app/modules/admin/production-plan/production-plan.component';
import { ProductionPlanService } from '../../production-plan.service';
import { ProductionPlanBatchDetailComponent } from '../batch/production-plan-detail.component';
import { ProductionPlanMonthDetailComponent } from './production-plan-detail.component';

export default [
    {
        path: '',
        component: ProductionPlanComponent,
        resolve: {
            productionPlan: () =>
                inject(ProductionPlanService).getProductionPlans(),
        },
    },
    {
        path: ':id',
        component: ProductionPlanMonthDetailComponent,
        resolve: {
            productionPlan: (route: ActivatedRoute) =>
                inject(ProductionPlanService).getProductionPlanById(
                    route.params['id']
                ),
        },
    },
    {
        path: 'childs/:id',
        component: ProductionPlanBatchDetailComponent,
        resolve: {
            productionPlan: (route: ActivatedRoute) =>
                inject(ProductionPlanService).getProductionPlanById(
                    route.params['id']
                ),
        },
    },
] as Routes;
