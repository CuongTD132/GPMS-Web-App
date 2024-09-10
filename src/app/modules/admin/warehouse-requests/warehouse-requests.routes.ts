import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { WarehouseRequestComponent } from './warehouse-requests.component';
import { WarehouseRequestService } from './warehouse-requests.service';

export default [
    {
        path: '',
        component: WarehouseRequestComponent,
        resolve: {
            material: () =>
                inject(WarehouseRequestService).getWarehouseRequests(),
        },
    },
] as Routes;
