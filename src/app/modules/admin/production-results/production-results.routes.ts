import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ProductionResultComponent } from './production-results.component';
import { ProductionResultService } from './production-results.service';

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
