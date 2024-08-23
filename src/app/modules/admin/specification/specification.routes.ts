import { inject } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { SpecificationDetailComponent } from '../product/detail/specification-detail/specification-detail.component';
import { SpecificationService } from './specification.service';

export default [
    {
        path: ':id',
        component: SpecificationDetailComponent,
        resolve: {
            specification: (route: ActivatedRoute) =>
                inject(SpecificationService).getSpecificationById(route.params['id']),
        },
    },
] as Routes;
