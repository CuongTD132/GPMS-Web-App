import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { SeriesService } from '../series/series.service';
import { InspectionRequestComponent } from './inspection-request.component';

export default [
    {
        path: '',
        component: InspectionRequestComponent,
        resolve: {
            material: () => inject(SeriesService).getSeries(),
        },
    },
] as Routes;
