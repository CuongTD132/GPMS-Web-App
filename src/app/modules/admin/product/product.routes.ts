import { inject } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { ProductComponent } from 'app/modules/admin/product/product.component';
import { ProductDetailComponent } from './detail/product-detail.component';
import { ProductService } from './product.service';
import { CreateProductComponent } from './create/create-product.component';
import { CategoryService } from '../category/category.service';
import { ProductHeaderComponent } from './header/product-header.component';
import { MaterialService } from '../material/material.service';

export default [
    {
        path: '',
        component: ProductComponent,
        resolve: {
            product: () => inject(ProductService).getProducts(),
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: ''
            },
            {
                path: '',
                component: ProductHeaderComponent,
            },
            {
                path: 'create',
                component: CreateProductComponent,
                resolve: {
                    categories: () => inject(CategoryService).getCategories(),
                    materials: () => inject(MaterialService).getMaterials(),
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
        ],
    },


] as Routes;
