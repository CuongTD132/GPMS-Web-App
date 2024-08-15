import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
    constructor(
        public matDialogRef: MatDialogRef<SeriesComponent>,
        private _formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit() {
        this.initProductionSeriesForm();
        console.log(this.addSeriesForm.value);
    }

    initProductionSeriesForm() {
        this.addSeriesForm = this._formBuilder.group({
            code: [null, Validators.required],
            quantity: [0, Validators.required],
        });
    }

    addValueToSeriesArray() {
        if (this.addSeriesForm.valid) {
            const series: ProductionSeries = this.addSeriesForm.value;
            this.seriess.push(series);
            this.addSeriesForm.reset();
            console.log(this.seriess);
            this.totalQuantity += series.quantity;
        }
    }

    onProductionSeriesSubmit() {
        const productionSeries: Series[] = this.seriess;

        this.matDialogRef.close({
            status: 'success',
            data: productionSeries,
        });
    }
}
