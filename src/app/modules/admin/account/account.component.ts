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
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
import { AccountService } from './account.service';
import { CreateAccountComponent } from './create/create-account.component';
import { AccountDetailComponent } from './detail/account-detail.component';

@Component({
    selector: 'account',
    standalone: true,
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css'],
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
        CustomPipeModule,
    ],
})
export class AccountComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    @ViewChildren('inputField') inputFields: QueryList<ElementRef>;

    searchInputControl: UntypedFormControl = new UntypedFormControl();
    filterForm: UntypedFormGroup;

    accounts$: Observable<Account[]>;
    pagination: Pagination;
    isLoading: boolean = false;
    flashMessage: 'success' | 'error' | null = null;
    message: string = null;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _accountService: AccountService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: UntypedFormBuilder,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        // Get the accounts
        this.getAccounts();

        // Get the pagination
        this._accountService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination) => {
                // Update the pagination
                this.pagination = pagination;

                //console.log(this.pagination);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this.initFilterForm();
        this.subcribeFilterForm();
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

    private getAccounts() {
        this.accounts$ = this._accountService.accounts$;
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
                    this._accountService
                        .getAccounts(filter)
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

    openCreateAccountDialog() {
        this._dialog
            .open(CreateAccountComponent, {
                width: '720px',
            })
            .afterClosed()
            .subscribe((result) => {
                if (result === 'success') {
                    this.showFlashMessage(
                        'success',
                        'Create account successful',
                        3000
                    );
                }
                if (result === 'error') {
                    this.showFlashMessage(
                        'error',
                        'Create account failed',
                        3000
                    );
                }
            });
    }

    openAccountDetailDialog(id: string) {
        this._accountService.getAccountById(id).subscribe((account) => {
            if (account) {
                this._dialog
                    .open(AccountDetailComponent, {
                        width: '720px',
                    })
                    .afterClosed()
                    .subscribe((result) => {
                        if (result === 'success') {
                            this.showFlashMessage(
                                'success',
                                'Update account successful',
                                3000
                            );
                        }
                    });
            }
        });
    }
}
