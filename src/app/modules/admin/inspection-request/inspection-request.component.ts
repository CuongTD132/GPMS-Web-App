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
import { CustomPipeModule } from '@fuse/pipes/pipe.module';
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
import { SeriesService } from '../series/series.service';
import { CreateWarehouseRequestComponent } from './create/create-inspection-request.component';
import { InspectionRequestService } from './inspection-request.service';

@Component({
    selector: 'inspection-request',
    standalone: true,
    templateUrl: './inspection-request.component.html',
    styleUrls: ['./inspection-request.component.css'],
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
        CustomPipeModule,
    ],
})
export class InspectionRequestComponent implements OnInit, AfterViewInit {
    @ViewChildren('inputField') inputFields: QueryList<ElementRef>;
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    selectedSeries: string = null;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    filterForm: UntypedFormGroup;
    series$: Observable<ProductionSeries[]>;
    inspectionRequests$: Observable<InspectionRequest[]>;
    pagination: Pagination;
    isLoading: boolean = false;
    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _inspectionRequestService: InspectionRequestService,
        private _seriesService: SeriesService,
        private dateAdapter: DateAdapter<Date>,
        private _formBuilder: UntypedFormBuilder,
        private _dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getInspectionRequests();
        // Get the pagination
        this.getSeries();
        this._inspectionRequestService.pagination$
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
                        //console.log('pagination');

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
    private getSeries() {
        this.series$ = this._seriesService.series$;
    }
    private getInspectionRequests() {
        this.inspectionRequests$ =
            this._inspectionRequestService.inspectionRequests$;
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
            searchString: [null],
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
                    this._inspectionRequestService
                        .getInspectionRequests(filter)
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
    getFormattedDate(date: string): string {
        const parsedDate = this.dateAdapter.parse(
            date,
            'yyyy-MM-ddTHH:mm:ss.SSS'
        );
        return this.dateAdapter.format(parsedDate, 'yyyy-MM-dd');
    }
    openDialog() {
        this._seriesService.getSeries().subscribe();
        this._dialog
            .open(CreateWarehouseRequestComponent, {
                width: '720px',
                data: this.series$,
            })
            .afterClosed()
            .subscribe((result) => {
                if (result === 'success') {
                    this._inspectionRequestService
                        .getInspectionRequests()
                        .subscribe();
                    this.showFlashMessage(
                        'success',
                        'Create inspection request successfully',
                        3000
                    );
                }
                if (result === 'error') {
                    this.showFlashMessage(
                        'error',
                        'Create inspection request failed ',
                        3000
                    );
                }
            });
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
}
