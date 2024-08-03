import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AccountComponent } from 'app/modules/admin/account/account.component';
import { AccountService } from './account.service';

export default [
    {
        path: '',
        component: AccountComponent,
        resolve: {
            account: () => inject(AccountService).getAccounts(),
        },
    },
] as Routes;
