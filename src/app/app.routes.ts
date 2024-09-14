import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to '/home'
    { path: '', pathMatch: 'full', redirectTo: 'home' },

    // Redirect signed-in user to the '/home'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'home' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.routes'
                    ),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.routes'
                    ),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.routes'
                    ),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.routes'),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.routes'),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.routes'),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.routes'
                    ),
            },
        ],
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('app/modules/admin/home/home.routes'),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },
        children: [
            {
                path: 'materials',
                loadChildren: () =>
                    import('app/modules/admin/material/material.routes'),
            },
            // Dashboards
            {
                path: 'dashboards',
                children: [
                    {
                        path: 'project',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/project/project.routes'
                            ),
                    },
                    {
                        path: 'analytics',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/analytics/analytics.routes'
                            ),
                    },
                    {
                        path: 'finance',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/finance/finance.routes'
                            ),
                    },
                    {
                        path: 'crypto',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/crypto/crypto.routes'
                            ),
                    },
                ],
            },
            {
                path: 'accounts',
                loadChildren: () =>
                    import('app/modules/admin/account/account.routes'),
            },
            {
                path: 'departments',
                loadChildren: () =>
                    import('app/modules/admin/department/department.routes'),
            },
            {
                path: 'categories',
                loadChildren: () =>
                    import('app/modules/admin/category/category.routes'),
            },
            {
                path: 'products',
                loadChildren: () =>
                    import('app/modules/admin/product/product.routes'),
            },
            {
                path: 'production-plans',
                loadChildren: () =>
                    import(
                        'app/modules/admin/production-plan/production-plan.routes'
                    ),
            },
            {
                path: 'production-results',
                loadChildren: () =>
                    import(
                        'app/modules/admin/production-results/production-results.routes'
                    ),
            },
            {
                path: 'warehouse-requests',
                loadChildren: () =>
                    import(
                        'app/modules/admin/warehouse-requests/warehouse-requests.routes'
                    ),
            },
            {
                path: 'create-inspection-request',
                loadChildren: () =>
                    import(
                        'app/modules/admin/inspection-request/inspection-request.routes'
                    ),
            },
        ],
    },
];
