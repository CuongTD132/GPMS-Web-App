import { inject } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { ProductComponent } from 'app/modules/admin/product/product.component';
import { ProductDetailComponent } from './detail/product-detail.component';
import { ProductService } from './product.service';

export default [
    {
        path: '',
        component: ProductComponent,
        resolve: {
            product: () => inject(ProductService).getProducts(),
        },
    },
    {
        path: ':id',
        component: ProductDetailComponent,
        resolve: {
            product: (route: ActivatedRoute) =>
                inject(ProductService).getProductById(route.params['id']),
        },
    },
] as Routes;
