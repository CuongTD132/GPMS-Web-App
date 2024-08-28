import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { Pagination } from 'app/types/pagination.type';
import {
    Observable,
    Subject,
    debounceTime,
    filter,
    map,
    merge,
    of,
    switchMap,
    takeUntil,
} from 'rxjs';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductService } from '../product.service';
import { CategoryService } from '../../category/category.service';
import { CreateProductComponent } from '../create/create-product.component';

@Component({
    selector: 'product-header',
    standalone: true,
    templateUrl: './product-header.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSortModule,
        MatPaginatorModule,
        MatSelectModule,
        MatOptionModule,
        FuseAlertComponent,
        MatCheckboxModule,
        RouterModule,
        MatMenuModule,
        MatProgressBar,
        MatTooltipModule,
    ],
})
export class ProductHeaderComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    @ViewChildren('inputField') inputFields: QueryList<ElementRef>;
    filterForm: UntypedFormGroup;

    products$: Observable<Product[]>;
    pagination: Pagination;
    isLoading: boolean = false;
    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    categories: Category[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _productService: ProductService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: UntypedFormBuilder,
        private _dialog: MatDialog,
        private dateAdapter: DateAdapter<Date>,
        private _categoryService: CategoryService
    ) {}

    ngOnInit(): void {
        // Get the products
        this.getProducts();
        // Get the pagination
        this._productService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination) => {
                // Update the pagination
                this.pagination = pagination;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        this._categoryService
            .getCategories()
            .subscribe((category) => (this.categories = category.data));
        this.initFilterForm();
        this.subcribeFilterForm();
    }

    /**
     * Format sizes and colors
     */
    getFormattedSizesAndColors(datas: string[]): string {
        return datas.join(', ');
    }
    /**
     * Format date
     */
    getFormattedDate(date: string): string {
        const parsedDate = this.dateAdapter.parse(
            date,
            'yyyy-MM-ddTHH:mm:ss.SSS'
        );
        return this.dateAdapter.format(parsedDate, 'yyyy-MM-dd');
    }
    /**
     * After view init
     */
    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true,
            });

            // Detect changes
            this._changeDetectorRef.detectChanges();

            // If the invoices change the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    const isAsc = this._sort.direction === 'asc';
                    this.setSortFilter(this._sort.active, isAsc);
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;
                });

            // Get invoices if sort or page changes
            merge(this._sort.sortChange, this._paginator.page)
                .pipe(
                    switchMap(() => {
                        this.setPaginationFilter(
                            this._paginator.pageIndex,
                            this._paginator.pageSize
                        );
                        console.log('pagination');

                        this.isLoading = true;
                        return of(true);
                    }),
                    map(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe();
        }
    }

    private getProducts() {
        this.products$ = this._productService.products$;
    }

    private setPaginationFilter(pageIndex: number, pageSize: number) {
        this.filterForm.patchValue({
            pagination: {
                pageIndex: pageIndex,
                pageSize: pageSize,
            },
        });
    }

    private setSortFilter(orderBy: string, isAscending: boolean) {
        this.filterForm.controls['orderBy'].setValue(orderBy);
        this.filterForm.controls['isAscending'].setValue(isAscending);
    }

    private initFilterForm() {
        this.filterForm = this._formBuilder.group({
            search: [null],
            orderBy: [null],
            pagination: [
                {
                    pageIndex: this.pagination.pageIndex,
                    pageSize: this.pagination.pageSize,
                },
            ],
            isAscending: [true],
        });
    }

    private subcribeFilterForm() {
        this.filterForm.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(() => this.filterForm.valid),
                debounceTime(500),
                switchMap((filter) => {
                    this.isLoading = true;
                    this._productService
                        .getProducts(filter)
                        .subscribe((result) => {
                            if (result.data.length == 0) {
                                this.showFlashMessage(
                                    'error',
                                    'No items were found',
                                    3000
                                );
                            }
                        });
                    return of(true);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    private showFlashMessage(
        type: 'success' | 'error',
        message: string,
        time: number
    ): void {
        this.flashMessage = type;
        this.message = message;
        this._changeDetectorRef.markForCheck();
        setTimeout(() => {
            this.flashMessage = this.message = null;
            this._changeDetectorRef.markForCheck();
        }, time);
    }

    openCreateProductDialog() {
        const categories = this.categories;
        if (categories) {
            this._dialog
                .open(CreateProductComponent, {
                    width: '1080px',
                    data: categories,
                })
                .afterClosed()
                .subscribe((result) => {
                    if (result === 'success') {
                        this.showFlashMessage(
                            'success',
                            'Create product successful',
                            3000
                        );
                    }
                });
        }
    }

    approveProduct(id: string) {
        this._productService.approveProduct(id).subscribe(() => {
            this._productService.getProducts().subscribe();
        });
    }

    declineProduct(id: string) {
        this._productService.declineProduct(id).subscribe(() => {
            this._productService.getProducts().subscribe();
        });
    }
}
