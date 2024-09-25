import { inject } from '@angular/core';
import { ActivatedRoute, Routes } from '@angular/router';
import { ProductComponent } from 'app/modules/admin/product/product.component';
import { CategoryService } from '../category/category.service';
import { MaterialService } from '../material/material.service';
import { SizeService } from '../size/size.service';
import { CreateProductComponent } from './create/create-product.component';
import { DefineProductComponent } from './define/define-product.component';
import { ProductDetailComponent } from './detail/product-detail.component';
import { ProductHeaderComponent } from './header/product-header.component';
import { ProductService } from './product.service';

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
                redirectTo: '',
            },
            {
                path: '',
                component: ProductHeaderComponent,
            },
            {
                path: 'define',
                component: DefineProductComponent,
                resolve: {
                    categories: () => inject(CategoryService).getCategories(),
                    materials: () => inject(MaterialService).getMaterials(),
                    sizes: () => inject(SizeService).getSizesList(),
                },
            },
            {
                path: 'create',
                component: CreateProductComponent,
                resolve: {
                    categories: () => inject(CategoryService).getCategories(),
                    materials: () => inject(MaterialService).getMaterials(),
                    sizes: () => inject(SizeService).getSizesList(),
                },
            },
            {
                path: ':id',
                component: ProductDetailComponent,
                resolve: {
                    product: (route: ActivatedRoute) =>
                        inject(ProductService).getProductById(
                            route.params['id']
                        ),
                },
            },
        ],
    },
] as Routes;
