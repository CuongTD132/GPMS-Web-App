import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'series',
    templateUrl: 'series.component.html',
    styleUrls: ['series.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
    ],
})
export class SeriesComponent implements OnInit {
    seriess: Series[] = [];
    series: Series;
    addSeriesForm: UntypedFormGroup;
    totalQuantity: number = 0;
    requiredQuantity: number;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: BatchReqs,
        public matDialogRef: MatDialogRef<SeriesComponent>,
        private _formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit() {
        this.initProductionSeriesForm();
        this.requiredQuantity = this.data.quantity;
    }

    initProductionSeriesForm() {
        this.addSeriesForm = this._formBuilder.group({
            code: [null, Validators.required],
            quantity: [0, Validators.required],
        });
    }

    addValueToSeriesArray() {
        if (this.addSeriesForm.valid) {
            const series: Series = this.addSeriesForm.value;
            this.seriess.push(series);
            this.addSeriesForm.reset();
            this.totalQuantity += series.quantity;
        }
    }

    onProductionSeriesSubmit() {
        const productionRequirement: BatchReqs = {
            dayNumber: this.data.dayNumber,
            quantity: this.data.quantity,
            overTimeQuantity: this.data.overTimeQuantity,
            productionSeries: this.seriess,
        };
        console.log(productionRequirement);

        this.matDialogRef.close({
            status: 'success',
            data: productionRequirement,
        });
    }
}
