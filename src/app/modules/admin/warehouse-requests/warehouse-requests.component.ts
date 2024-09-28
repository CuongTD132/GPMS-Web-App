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
import { DateAdapter, MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
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
// import { CreateWarehouseRequestComponent } from './create/create-material.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomPipeModule } from '@fuse/pipes/pipe.module';
import { UserService } from 'app/core/user/user.service';
import { CreateWarehouseRequestComponent } from './create/create-warehouse-request.component';
import { DeclineComponent } from './decline/decline.component';
import { WarehouseRequestService } from './warehouse-requests.service';

@Component({
    selector: 'warehouse-requests',
    standalone: true,
    templateUrl: './warehouse-requests.component.html',
    styleUrls: ['./warehouse-requests.component.css'],
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
        MatProgressBar,
        MatExpansionModule,
        MatTooltipModule,
        MatMenuModule,
        CustomPipeModule,
    ],
})
export class WarehouseRequestComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    @ViewChildren('inputField') inputFields: QueryList<ElementRef>;

    searchInputControl: UntypedFormControl = new UntypedFormControl();
    filterForm: UntypedFormGroup;
    productionPlans$: Observable<ProductionPlan[]>;
    warehouseRequests$: Observable<WarehouseRequest[]>;
    warehouseRequestList: WarehouseRequest[] = [];
    warehouseRequest: WarehouseRequest;
    pagination: Pagination;
    isLoading: boolean = false;
    flashMessage: 'success' | 'error' | null = null;
    role: string = null;
    message: string = null;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _warehouseRequestService: WarehouseRequestService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: UntypedFormBuilder,
        private _userService: UserService,
        private dateAdapter: DateAdapter<Date>,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._userService.get().subscribe((user) => {
            this.role = user.role;
        }); // Get the warehouseRequests
        this.getWarehouseRequests();
        // Get the pagination
        this._warehouseRequestService.pagination$
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

    openPanel(id: string) {
        const existingRequest = this.warehouseRequestList.find(
            (warehouseRequest) => warehouseRequest.id === id
        );

        if (existingRequest) {
            this.warehouseRequest = existingRequest;
        } else {
            this.getDetail(id);
        }
    }

    getDetail(id: string) {
        this.warehouseRequest = null;
        this._warehouseRequestService
            .getWarehouseRequestById(id)
            .subscribe((res) => {
                if (res) {
                    this.warehouseRequestList.push(res);
                    this.warehouseRequest = res;
                }
            });
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

    getFormattedDate(date: string): string {
        const parsedDate = this.dateAdapter.parse(
            date,
            'yyyy-MM-ddTHH:mm:ss.SSS'
        );
        return this.dateAdapter.format(parsedDate, 'yyyy-MM-dd');
    }

    private getWarehouseRequests() {
        this.warehouseRequests$ =
            this._warehouseRequestService.warehouseRequests$;
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
                    this._warehouseRequestService
                        .getWarehouseRequests(filter)
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

    approve(id: string): void {
        this._warehouseRequestService.approveWarehouseRequest(id).subscribe({
            next: () => {
                this._warehouseRequestService
                    .getWarehouseRequests()
                    .subscribe();
                this.warehouseRequestList = this.warehouseRequestList.filter(
                    (warehouseRequest) => warehouseRequest.id !== id
                );
                this.showFlashMessage(
                    'success',
                    'Request has been approve successful',
                    3000
                );
            },
            error: () =>
                this.showFlashMessage(
                    'error',
                    'Request has been approve failed',
                    3000
                ),
        });
    }

    decline(id: string): void {
        this._dialog
            .open(DeclineComponent, {
                width: '720px',
                data: id,
            })
            .afterClosed()
            .subscribe((result) => {
                //console.log(result);

                if (result === 'success') {
                    this._warehouseRequestService
                        .getWarehouseRequests()
                        .subscribe();
                    this.warehouseRequestList =
                        this.warehouseRequestList.filter(
                            (warehouseRequest) => warehouseRequest.id !== id
                        );
                    this.showFlashMessage(
                        'success',
                        'Request has been decline successful',
                        3000
                    );
                }
                if (result === 'error') {
                    this.showFlashMessage(
                        'error',
                        'Request has been decline failed',
                        3000
                    );
                }
            });
    }

    openCreateWarehouseRequestDialog() {
        this.productionPlans$ =
            this._warehouseRequestService.getBatchPlanList();
        this.productionPlans$.subscribe((res) => {
            this._dialog
                .open(CreateWarehouseRequestComponent, {
                    width: '720px',
                    data: res,
                })
                .afterClosed()
                .subscribe((result) => {
                    if (result === 'success') {
                        this._warehouseRequestService
                            .getWarehouseRequests()
                            .subscribe();

                        this.showFlashMessage(
                            'success',
                            'Create warehouse request successful',
                            3000
                        );
                    }
                    if (result === 'error') {
                        this.showFlashMessage(
                            'error',
                            'Create warehouse request failed',
                            3000
                        );
                    }
                });
        });
    }
}
