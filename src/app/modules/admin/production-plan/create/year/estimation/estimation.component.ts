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
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
@Component({
    selector: 'year-estimations',
    templateUrl: 'estimation.component.html',
    styleUrls: ['estimation.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
    ],
})
export class EstimationComponent implements OnInit {
    estimations: any[] = [];
    estimation: Specification;
    addProductionEstimationForm: UntypedFormGroup;
    addProductionRequirementForm: UntypedFormGroup;
    totalQuantity: number = 0;
    constructor(
        public matDialogRef: MatDialogRef<EstimationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Specification,
        private _formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit() {
        this.estimation = this.data;
        this.initProductionEstimationForm();
    }

    initProductionEstimationForm() {
        this.addProductionEstimationForm = this._formBuilder.group({
            quantity: [null, Validators.required],
            overTimeQuantity: [null, Validators.required],
            month: ['none', Validators.required],
        });
    }

    addValueToEstimationArray() {
        if (
            this.addProductionEstimationForm.valid &&
            this.addProductionEstimationForm.get('month').value !== 'none'
        ) {
            const estimation: ProductionEstimation =
                this.addProductionEstimationForm.value;
            this.estimations.push(estimation);
            this.addProductionEstimationForm.reset();
            console.log(estimation);
            this.totalQuantity += estimation.quantity;
        }
    }

    onProductionEstimationSubmit() {
        const productionRequirement: any = {
            productionSpecificationId: this.data.id,
            quantity: this.totalQuantity,
            productionEstimations: this.estimations,
        };
        this.matDialogRef.close({
            status: 'success',
            data: productionRequirement,
        });
    }
}
