import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, map } from 'rxjs';
import { InspectionRequestService } from '../inspection-request.service';

@Component({
    selector: 'create-inspection-request',
    standalone: true,
    templateUrl: './create-inspection-request.component.html',
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
    ],
})
export class CreateWarehouseRequestComponent implements OnInit {
    selectedProPlan: string = null;
    id: string = null;
    createForm: FormGroup;
    inspectionRequestForm: FormGroup;
    constructor(
        public matDialogRef: MatDialogRef<CreateWarehouseRequestComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Observable<ProductionSeries[]>,
        private _inspectionRequestService: InspectionRequestService,
        private _formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.inspectionRequestForm = this._formBuilder.group({
            productionSeriesId: [null, [Validators.required]],
            requiredQuantity: [null, [Validators.required]],
            description: null,
        });
    }

    onSeriesChange(seriesId: string): void {
        const selectedSeries = this.data.pipe(
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
            //console.log(this.inspectionRequestForm.value);
        });
    }
    create() {
        if (this.inspectionRequestForm.valid) {
            this._inspectionRequestService
                .createInspectionRequest(this.inspectionRequestForm.value)
                .subscribe({
                    next: (result) => {
                        this.matDialogRef.close('success');
                    },
                    error: (err) => {
                        this.matDialogRef.close('error');
                    },
                });
        }
    }
}
