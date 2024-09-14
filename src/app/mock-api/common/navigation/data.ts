/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'products',
        title: 'Products',
        type: 'basic',
        icon: 'heroicons_outline:cube',
        link: '/products',
        permissions: ['ProductionManager', 'FactoryDirector'],
    },
    {
        id: 'production-plans',
        title: 'Production Plans',
        type: 'basic',
        icon: 'heroicons_outline:rectangle-stack',
        link: '/production-plans',
        permissions: ['ProductionManager', 'FactoryDirector'],
    },
    {
        id: 'production-results',
        title: 'Production Results',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-document-list',
        link: '/production-results',
        permissions: [
            'ProductionManager',
            'FactoryDirector',
            'ProductionStaff',
        ],
    },
    {
        id: 'create-inspection-request',
        title: 'Create Inspection Request',
        type: 'basic',
        icon: 'heroicons_outline:rss',
        link: '/create-inspection-request',
        permissions: ['ProductionManager'],
    },
    {
        id: 'warehouse-requests',
        title: 'Warehouse Requests',
        type: 'basic',
        icon: 'heroicons_outline:building-storefront',
        link: '/warehouse-requests',
        permissions: [
            'ProductionManager',
            'FactoryDirector',
            'WarehouseManager',
        ],
    },
    {
        id: 'materials',
        title: 'Materials',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/materials',
        permissions: ['ProductionManager', 'FactoryDirector'],
    },
    {
        id: 'categories',
        title: 'Categories',
        type: 'basic',
        icon: 'heroicons_outline:inbox-stack',
        link: '/categories',
        permissions: ['ProductionManager', 'FactoryDirector'],
    },
    {
        id: 'accounts',
        title: 'Accounts',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/accounts',
        permissions: ['Admin'],
    },
    {
        id: 'departments',
        title: 'Departments',
        type: 'basic',
        icon: 'heroicons_outline:server-stack',
        link: '/departments',
        permissions: ['Admin', 'ProductionManager'],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'products',
        title: 'Products',
        type: 'basic',
        icon: 'heroicons_outline:cube',
        link: '/products',
        permissions: ['ProductionManager', 'FactoryDirector'],
    },
    {
        id: 'production-plans',
        title: 'Production Plans',
        type: 'basic',
        icon: 'heroicons_outline:rectangle-stack',
        link: '/production-plans',
        permissions: ['ProductionManager', 'FactoryDirector'],
    },
    {
        id: 'production-results',
        title: 'Production Results',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-document-list',
        link: '/production-results',
        permissions: [
            'ProductionManager',
            'FactoryDirector',
            'ProductionStaff',
        ],
    },
    {
        id: 'create-inspection-request',
        title: 'Create Inspection Request',
        type: 'basic',
        icon: 'heroicons_outline:rss',
        link: '/create-inspection-request',
        permissions: ['ProductionManager'],
    },
    {
        id: 'warehouse-requests',
        title: 'Warehouse Requests',
        type: 'basic',
        icon: 'heroicons_outline:building-storefront',
        link: '/warehouse-requests',
        permissions: [
            'ProductionManager',
            'FactoryDirector',
            'WarehouseManager',
        ],
    },
    {
        id: 'materials',
        title: 'Materials',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/materials',
        permissions: ['ProductionManager', 'FactoryDirector'],
    },
    {
        id: 'categories',
        title: 'Categories',
        type: 'basic',
        icon: 'heroicons_outline:inbox-stack',
        link: '/categories',
        permissions: ['ProductionManager', 'FactoryDirector'],
    },
    {
        id: 'accounts',
        title: 'Accounts',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/accounts',
        permissions: ['Admin'],
    },
    {
        id: 'departments',
        title: 'Departments',
        type: 'basic',
        icon: 'heroicons_outline:server-stack',
        link: '/departments',
        permissions: ['ProductionManager'],
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'products',
        title: 'Products',
        type: 'basic',
        icon: 'heroicons_outline:cube',
        link: '/products',
        permissions: ['ProductionManager', 'FactoryDirector'],
    },
    {
        id: 'production-plans',
        title: 'Production Plans',
        type: 'basic',
        icon: 'heroicons_outline:rectangle-stack',
        link: '/production-plans',
        permissions: ['ProductionManager', 'FactoryDirector'],
    },
    {
        id: 'production-results',
        title: 'Production Results',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-document-list',
        link: '/production-results',
        permissions: [
            'ProductionManager',
            'FactoryDirector',
            'ProductionStaff',
        ],
    },
    {
        id: 'create-inspection-request',
        title: 'Create Inspection Request',
        type: 'basic',
        icon: 'heroicons_outline:rss',
        link: '/create-inspection-request',
        permissions: ['ProductionManager'],
    },
    {
        id: 'warehouse-requests',
        title: 'Warehouse Requests',
        type: 'basic',
        icon: 'heroicons_outline:building-storefront',
        link: '/warehouse-requests',
        permissions: [
            'ProductionManager',
            'FactoryDirector',
            'WarehouseManager',
        ],
    },
    {
        id: 'materials',
        title: 'Materials',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/materials',
        permissions: ['ProductionManager', 'FactoryDirector'],
    },
    {
        id: 'categories',
        title: 'Categories',
        type: 'basic',
        icon: 'heroicons_outline:inbox-stack',
        link: '/categories',
        permissions: ['ProductionManager', 'FactoryDirector'],
    },
    {
        id: 'accounts',
        title: 'Accounts',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/accounts',
        permissions: ['Admin'],
    },
    {
        id: 'departments',
        title: 'Departments',
        type: 'basic',
        icon: 'heroicons_outline:server-stack',
        link: '/departments',
        permissions: ['Admin', 'ProductionManager'],
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'products',
        title: 'Products',
        type: 'basic',
        icon: 'heroicons_outline:cube',
        link: '/products',
        permissions: ['ProductionManager', 'FactoryDirector'],
    },
    {
        id: 'production-plans',
        title: 'Production Plans',
        type: 'basic',
        icon: 'heroicons_outline:rectangle-stack',
        link: '/production-plans',
        permissions: ['ProductionManager', 'FactoryDirector'],
    },
    {
        id: 'production-results',
        title: 'Production Results',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-document-list',
        link: '/production-results',
        permissions: [
            'ProductionManager',
            'FactoryDirector',
            'ProductionStaff',
        ],
    },
    {
        id: 'create-inspection-request',
        title: 'Create Inspection Request',
        type: 'basic',
        icon: 'heroicons_outline:rss',
        link: '/create-inspection-request',
        permissions: ['ProductionManager'],
    },
    {
        id: 'warehouse-requests',
        title: 'Warehouse Requests',
        type: 'basic',
        icon: 'heroicons_outline:building-storefront',
        link: '/warehouse-requests',
        permissions: [
            'ProductionManager',
            'FactoryDirector',
            'WarehouseManager',
        ],
    },
    {
        id: 'materials',
        title: 'Materials',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/materials',
        permissions: ['ProductionManager', 'FactoryDirector'],
    },
    {
        id: 'categories',
        title: 'Categories',
        type: 'basic',
        icon: 'heroicons_outline:inbox-stack',
        link: '/categories',
        permissions: ['ProductionManager', 'FactoryDirector'],
    },
    {
        id: 'accounts',
        title: 'Accounts',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/accounts',
        permissions: ['Admin'],
    },
    {
        id: 'departments',
        title: 'Departments',
        type: 'basic',
        icon: 'heroicons_outline:server-stack',
        link: '/departments',
        permissions: ['Admin', 'ProductionManager'],
    },
];
