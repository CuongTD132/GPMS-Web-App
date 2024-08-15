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
    selector: 'day-estimations',
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
        MatSelectModule,
    ],
})
export class SeriesComponent implements OnInit {
    estimations: any[] = [];
    estimation: any;
    addProductionEstimationForm: UntypedFormGroup;
    totalQuantity: number = 0;

    constructor(
        public matDialogRef: MatDialogRef<SeriesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: UntypedFormBuilder,
    ) {
    }

    ngOnInit() {
        this.estimation = this.data;
        this.initProductionEstimationForm();
    }

    initProductionEstimationForm() {
        this.addProductionEstimationForm = this._formBuilder.group({
            quantity: [null, Validators.required],
            overTimeQuantity: [null, Validators.required],
            dayNumber: [1, Validators.required],
            productionSeries: [[]],
        });
    }

    addValueToEstimationArray() {
        if (this.addProductionEstimationForm.valid) {
            const estimation: ProductionEstimation =
                this.addProductionEstimationForm.value;
            this.estimations.push(estimation);
            this.addProductionEstimationForm.reset();
            console.log(estimation);
            this.totalQuantity += estimation.quantity;
        }
    }

    onProductionEstimationSubmit() {
        console.log(this.data);

        if (this.totalQuantity === this.estimation.quantity) {
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


}
