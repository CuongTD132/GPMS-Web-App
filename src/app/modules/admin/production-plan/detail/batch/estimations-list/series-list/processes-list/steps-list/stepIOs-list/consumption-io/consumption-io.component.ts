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
    selector: 'consumption-io',
    standalone: true,
    templateUrl: './consumption-io.component.html',
    styleUrls: ['./consumption-io.component.css'],

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
export class ConsumptionIOsResultComponent implements OnInit {
    consumptionForm: UntypedFormGroup;
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            id: string;
            addedConsumption: number;
        },
        public matDialogRef: MatDialogRef<ConsumptionIOsResultComponent>,
        private _formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit(): void {
        this.initConsumptionForm();
        console.log(this.data);
    }

    initConsumptionForm() {
        this.consumptionForm = this._formBuilder.group({
            stepInputOutputId: [this.data.id, [Validators.required]],
            consumption: [this.data.addedConsumption, [Validators.required]],
        });
    }

    submit() {
        console.log(this.consumptionForm.value);

        if (this.consumptionForm.valid) {
            this.matDialogRef.close({
                status: 'success',
                data: this.consumptionForm.value,
            });
            this.initConsumptionForm();
        }
    }
}
