import { inject } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { StepDetailComponent } from '../product/detail/process-detail/step-detail/step-detail.component';
import { StepService } from './step.service';

export default [
    {
        path: ':id',
        component: StepDetailComponent,
        resolve: {
            specification: (route: ActivatedRoute) =>
                inject(StepService).getStepById(route.params['id']),
        },
    },
] as Routes;
