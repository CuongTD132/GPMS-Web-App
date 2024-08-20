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
    selector: 'create-boms',
    standalone: true,
    templateUrl: './boms.component.html',
    styleUrls: ['./boms.component.css'],

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
export class BomsComponent implements OnInit {
    measurementForm: UntypedFormGroup;
    boms: BillOfMaterial[] = [];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Material[],
        public matDialogRef: MatDialogRef<BomsComponent>,
        private _formBuilder: UntypedFormBuilder
    ) {}
    ngOnInit(): void {
        this.initMeasurementForm();
    }

    initMeasurementForm() {
        this.measurementForm = this._formBuilder.group({
            sizeWidth: [null, [Validators.required]],
            consumption: [null, [Validators.required]],
            description: null,
            materialId: ['none', [Validators.required]],
        });
    }

    getMaterialName(id: string) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id === id) {
                return this.data[i].name;
            }
        }
        return null;
    }

    addValueToBomArray() {
        if (
            this.measurementForm.valid &&
            this.measurementForm.get('materialId').value !== 'none'
        ) {
            const bom: BillOfMaterial = this.measurementForm.value;
            this.boms.push(bom);
            this.measurementForm.reset();
            this.initMeasurementForm();
        }
    }

    submit() {
        this.matDialogRef.close({
            status: 'success',
            data: this.boms,
        });
    }
}
