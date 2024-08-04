import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { DepartmentComponent } from 'app/modules/admin/department/department.component';
import { DepartmentService } from './department.service';

export default [
    {
        path: '',
        component: DepartmentComponent,
        resolve: {
            department: () => inject(DepartmentService).getDepartments(),
        },
    },
] as Routes;
