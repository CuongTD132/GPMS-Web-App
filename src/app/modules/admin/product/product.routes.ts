import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ProductComponent } from 'app/modules/admin/product/product.component';
import { ProductService } from './product.service';

export default [
    {
        path: '',
        component: ProductComponent,
        resolve: {
            product: () => inject(ProductService).getProducts(),
        },
    },
] as Routes;
