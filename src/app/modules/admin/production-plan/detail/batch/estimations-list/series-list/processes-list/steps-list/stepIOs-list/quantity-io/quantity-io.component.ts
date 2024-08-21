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
    selector: 'quantity-io',
    standalone: true,
    templateUrl: './quantity-io.component.html',
    styleUrls: ['./quantity-io.component.css'],

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
export class QuantityIOsResultComponent implements OnInit {
    quantityForm: UntypedFormGroup;
    quantities: Measurement[] = [];
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            id: string;
            addedQuantity: number;
        },
        public matDialogRef: MatDialogRef<QuantityIOsResultComponent>,
        private _formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit(): void {
        this.initQuantityForm();
        console.log(this.data);
    }

    initQuantityForm() {
        this.quantityForm = this._formBuilder.group({
            stepInputOutputId: [this.data.id, [Validators.required]],
            quantity: [this.data.addedQuantity, [Validators.required]],
        });
    }

    submit() {
        console.log(this.quantityForm.value);

        if (this.quantityForm.valid) {
            this.matDialogRef.close({
                status: 'success',
                data: this.quantityForm.value,
            });
            this.initQuantityForm();
        }
    }
}
