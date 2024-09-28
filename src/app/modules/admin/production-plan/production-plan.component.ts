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
    UntypedFormControl,
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
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { CustomPipeModule } from '@fuse/pipes/pipe.module';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
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
import { ProductService } from '../product/product.service';
import { ApprovedProductComponent } from './aprroved-products/aprroved-products.component';
import { ProductionPlanService } from './production-plan.service';

@Component({
    selector: 'production-plan',
    standalone: true,
    templateUrl: './production-plan.component.html',
    styleUrls: ['./production-plan.component.css'],
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
        MatProgressBar,
        MatMenuModule,
        MatTooltipModule,
        CustomPipeModule,
    ],
})
export class ProductionPlanComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    @ViewChildren('inputField') inputFields: QueryList<ElementRef>;
    @ViewChild('uploadYearExcel') private _avatarFileInput: ElementRef;

    searchInputControl: UntypedFormControl = new UntypedFormControl();
    filterForm: UntypedFormGroup;
    products$: Observable<Product[]>;
    productionPlans$: Observable<ProductionPlan[]>;
    pagination: Pagination;
    isLoading: boolean = false;
    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    role: string = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _productService: ProductService,
        private _productionPlanService: ProductionPlanService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: UntypedFormBuilder,
        private _userService: UserService,
        private _dialog: MatDialog,
        private dateAdapter: DateAdapter<Date>,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngOnInit(): void {
        this.getProductionPlans();
        this._userService.get().subscribe((user) => {
            this.role = user.role;
        });
        // Get the pagination
        this._productionPlanService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination) => {
                // Update the pagination
                this.pagination = pagination;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        this.initFilterForm();
        this.subcribeFilterForm();
    }

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

            // If the invoices changes the sort order...
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

    private getProductionPlans() {
        this.productionPlans$ = this._productionPlanService.productionPlans$;
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
                    this._productionPlanService
                        .getProductionPlans(filter)
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

    openAprrovedProductDialog() {
        this._productService.getApprovedProducts().subscribe((res) => {
            this._dialog
                .open(ApprovedProductComponent, {
                    width: '720px',
                    data: res,
                })
                .afterClosed()
                .subscribe((res) => {
                    if (res === 'success') {
                        this.showFlashMessage(
                            'success',
                            'Create year production plan successful',
                            3000
                        );
                    }
                });
        });
    }

    showConfirmDialog(id: string, name: string) {
        this._fuseConfirmationService
            .open({
                title: 'Are you sure?',
                message: 'This action will delete ' + name,
                icon: {
                    color: 'error',
                    name: 'heroicons_outline:trash',
                },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result === 'confirmed') {
                    this.deleteProductionPlan(id);
                }
                if (result === 'cancelled') {
                }
            });
    }

    deleteProductionPlan(id: string) {
        //console.log('hihi');

        this._productionPlanService.deleteProductionPlan(id).subscribe(() => {
            this._productionPlanService.getProductionPlans().subscribe({
                next: () => {
                    this.showFlashMessage(
                        'success',
                        'Production plan has been delete successful',
                        3000
                    );
                },
                error: () =>
                    this.showFlashMessage(
                        'error',
                        'Production plan has been delete failed',
                        3000
                    ),
            });
        });
    }

    uploadYearExcelFile(fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = [
            '.xlsx',
            '.xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        const file = fileList[0];
        //console.log(file.type);

        // Return if the file is not allowed
        if (!allowedTypes.includes(file.type)) {
            this.showFlashMessage('error', 'Wrong file format!', 3000);
            return;
        }
        const formData = new FormData();

        formData.append('files', file);
        // Upload the avatar
        this._productionPlanService.uploadYearExcel(formData).subscribe({
            next: () => {
                this._productionPlanService.getProductionPlans().subscribe();
                this.showFlashMessage(
                    'success',
                    'Annual production plan has been upload successful',
                    3000
                );
            },
            error: () =>
                this.showFlashMessage(
                    'error',
                    'Annual production plan has been upload failed',
                    3000
                ),
        });
    }
}
