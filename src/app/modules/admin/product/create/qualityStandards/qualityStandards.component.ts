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
    selector: 'create-qualityStandards',
    standalone: true,
    templateUrl: './qualityStandards.component.html',
    styleUrls: ['./qualityStandards.component.css'],

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
export class QualityStandardsComponent implements OnInit {
    qualityStandardForm: UntypedFormGroup;
    qualityStandards: QualityStandard[] = [];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Material[],
        public matDialogRef: MatDialogRef<QualityStandardsComponent>,
        private _formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit(): void {
        this.initQualityStandardForm();
        console.log(this.data);
    }

    initQualityStandardForm() {
        this.qualityStandardForm = this._formBuilder.group({
            name: [null, [Validators.required]],
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
    addValueToQualityStandardArray() {
        if (
            this.qualityStandardForm.valid &&
            this.qualityStandardForm.get('materialId').value !== 'none'
        ) {
            const qualityStandard: QualityStandard =
                this.qualityStandardForm.value;
            this.qualityStandards.push(qualityStandard);
            this.qualityStandardForm.reset();
            console.log(this.qualityStandards);
        }
    }

    submit() {
        this.matDialogRef.close({
            status: 'success',
            data: this.qualityStandards,
        });
    }
}
