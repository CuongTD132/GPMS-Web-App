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
    selector: 'batch-estimations',
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
    estimation: any;
    addProductionEstimationForm: UntypedFormGroup;
    addProductionRequirementForm: UntypedFormGroup;
    totalQuantity: number = 0;
    constructor(
        public matDialogRef: MatDialogRef<EstimationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: UntypedFormBuilder
    ) {}
    batchNumber: number = 1;
    ngOnInit() {
        this.estimation = this.data;
        this.initProductionEstimationForm();
    }

    initProductionEstimationForm() {
        this.addProductionEstimationForm = this._formBuilder.group({
            quantity: [null, Validators.required],
            overTimeQuantity: [null, Validators.required],
            batch: [1, Validators.required],
        });
    }

    addValueToEstimationArray() {
        if (this.addProductionEstimationForm.valid) {
            const estimation: ProductionEstimation =
                this.addProductionEstimationForm.value;
            this.estimations.push(estimation);
            this.addProductionEstimationForm.reset();
            this.batchNumber = this.batchNumber + 1;
            this.totalQuantity += estimation.quantity;
        }
    }

    onProductionEstimationSubmit() {
            const productionRequirement: any = {
                productionSpecificationId: this.data.specificationId,
                quantity: this.totalQuantity,
                productionEstimations: this.estimations,
            };
            this.matDialogRef.close({
                status: 'success',
                data: productionRequirement,
            });
    }
}
