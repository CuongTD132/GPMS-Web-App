import { inject } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { ProductionPlanComponent } from 'app/modules/admin/production-plan/production-plan.component';
import { ProductionPlanBatchDetailComponent } from './detail/batch/production-plan-detail.component';
import { ProductionPlanMonthDetailComponent } from './detail/month/production-plan-detail.component';
import { ProductionPlanYearDetailComponent } from './detail/year/production-plan-detail.component';
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
    {
        path: 'years/:id',
        component: ProductionPlanYearDetailComponent,
        resolve: {
            productionPlan: (route: ActivatedRoute) =>
                inject(ProductionPlanService).getProductionPlanById(
                    route.params['id']
                ),
        },
    },
    {
        path: 'months/:id',
        component: ProductionPlanMonthDetailComponent,
        resolve: {
            productionPlan: (route: ActivatedRoute) =>
                inject(ProductionPlanService).getProductionPlanById(
                    route.params['id']
                ),
        },
    },
    {
        path: 'batchs/:id',
        component: ProductionPlanBatchDetailComponent,
        resolve: {
            productionPlan: (route: ActivatedRoute) =>
                inject(ProductionPlanService).getProductionPlanById(
                    route.params['id']
                ),
        },
    },
] as Routes;
