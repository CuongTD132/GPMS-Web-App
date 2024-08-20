import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'create-measurements',
    standalone: true,
    templateUrl: './measurements.component.html',
    styleUrls: ['./measurements.component.css'],

    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
    ],
})
export class MeasurementsComponent implements OnInit {
    measurementForm: UntypedFormGroup;
    measurements: Measurement[] = [];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Category[],
        public matDialogRef: MatDialogRef<MeasurementsComponent>,
        private _formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit(): void {
        this.initMeasurementForm();
    }

    initMeasurementForm() {
        this.measurementForm = this._formBuilder.group({
            name: [null, [Validators.required]],
            measure: [null, [Validators.required]],
            unit: [null, [Validators.required]],
        });
    }

    addValueToMeasurementArray() {
        if (this.measurementForm.valid) {
            const measurement: Measurement = this.measurementForm.value;
            this.measurements.push(measurement);
            this.measurementForm.reset();
            console.log(this.measurements);
        }
    }

    submit() {
        this.matDialogRef.close({
            status: 'success',
            data: this.measurements,
        });
    }
}
