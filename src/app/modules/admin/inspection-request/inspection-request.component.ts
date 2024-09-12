import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    QueryList,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { FuseAlertComponent } from '@fuse/components/alert';
import { Pagination } from 'app/types/pagination.type';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { SeriesService } from '../series/series.service';
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
    ],
})
export class InspectionRequestComponent implements OnInit {
    @ViewChildren('inputField') inputFields: QueryList<ElementRef>;
    selectedSeries: string = null;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    filterForm: UntypedFormGroup;
    series$: Observable<ProductionSeries[]>;
    warehouseRequest: ProductionSeries;
    pagination: Pagination;
    isLoading: boolean = false;
    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    inspectionRequestForm: FormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _inspectionRequestService: InspectionRequestService,
        private _seriesService: SeriesService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit(): void {
        this.getSeries();
        this.initForm();
        // Get the pagination
        this._seriesService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination) => {
                // Update the pagination
                this.pagination = pagination;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    initForm() {
        this.inspectionRequestForm = this._formBuilder.group({
            productionSeriesId: [null, [Validators.required]],
            requiredQuantity: [null, [Validators.required]],
            description: null,
        });
    }
    private getSeries() {
        this.series$ = this._seriesService.series$;
    }

    onSeriesChange(seriesId: string): void {
        const selectedSeries = this.series$.pipe(
            map((series) => series.find((item) => item.id === seriesId))
        );

        selectedSeries.subscribe((series) => {
            if (series) {
                if (series.faultyQuantity) {
                    this.inspectionRequestForm
                        .get('requiredQuantity')
                        .setValue(series.faultyQuantity);
                } else {
                    this.inspectionRequestForm
                        .get('requiredQuantity')
                        .setValue(series.quantity);
                }
            }
            console.log(this.inspectionRequestForm.value);
        });
    }

    create() {
        if (this.inspectionRequestForm.valid) {
            this._inspectionRequestService
                .createInspectionRequest(this.inspectionRequestForm.value)
                .subscribe({
                    next: (result) => {
                        this.initForm();
                        this._seriesService.getSeries().subscribe();
                        this.showFlashMessage(
                            'success',
                            'Create inspection request successfully',
                            3000
                        );
                    },
                    error: (err) => {
                        this.showFlashMessage(
                            'error',
                            'Create inspection request failed ',
                            3000
                        );
                    },
                });
        }
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
