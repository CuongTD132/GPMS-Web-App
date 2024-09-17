import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ProductionResultComponent } from './enter-production-results.component';
import { ProductionResultService } from './enter-production-results.service';

export default [
    {
        path: '',
        component: ProductionResultComponent,
        resolve: {
            productionResult: () =>
                inject(
                    ProductionResultService
                ).getBatchProductionPlansInProgress(),
        },
    },
] as Routes;
