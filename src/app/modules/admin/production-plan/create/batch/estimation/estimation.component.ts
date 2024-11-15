import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SeriesComponent } from './series/series.component';

@Component({
    selector: 'day-estimations',
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
    estimations: BatchReqs[] = [];
    addedEstimations: BatchReqs[] = [];
    estimation: any;
    addProductionEstimationForm: UntypedFormGroup;
    totalQuantity: number = 0;
    constructor(
        public matDialogRef: MatDialogRef<EstimationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: UntypedFormBuilder,
        private _dialog: MatDialog
    ) {}

    ngOnInit() {
        this.estimation = this.data;
        this.initProductionEstimationForm();
    }

    initProductionEstimationForm() {
        this.addProductionEstimationForm = this._formBuilder.group({
            quantity: [null, Validators.required],
            overTimeQuantity: [null, Validators.required],
            dayNumber: [1, Validators.required],
            productionSeries: [],
        });
    }

    addValueToEstimationArray() {
        if (this.addProductionEstimationForm.valid) {
            const estimation: BatchReqs =
                this.addProductionEstimationForm.value;
            this.addedEstimations.push(estimation);
            this.addProductionEstimationForm.reset();
            //console.log(estimation);
            this.totalQuantity += estimation.quantity;
        }
    }

    onProductionEstimationSubmit() {
        if (this.totalQuantity === this.estimation.quantity) {
            const productionRequirement: any = {
                productionSpecificationId: this.data.specificationId,
                quantity: this.totalQuantity,
                productionEstimations: this.estimations,
            };
            //console.log(productionRequirement);

            this.matDialogRef.close({
                status: 'success',
                data: productionRequirement,
            });
        }
    }

    openSeriesDialog(item: BatchReqs) {
        this._dialog
            .open(SeriesComponent, {
                width: '720px',
                data: item,
            })
            .afterClosed()
            .subscribe((result) => {
                if (result.status == 'success') {
                    this.estimations.push(result.data);
                    //console.log(this.estimations);

                    this.addProductionEstimationForm.setValue(this.estimations);
                    //console.log(this.addProductionEstimationForm.value);
                }
            });
    }
}
