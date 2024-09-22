import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { SeriesService } from '../series/series.service';
import { InspectionRequestComponent } from './inspection-request.component';
import { InspectionRequestService } from './inspection-request.service';

export default [
    {
        path: '',
        component: InspectionRequestComponent,
        resolve: {
            inspectionRequest: () =>
                inject(InspectionRequestService).getInspectionRequests(),
            series: () => inject(SeriesService).getSeries(),
        },
    },
] as Routes;
