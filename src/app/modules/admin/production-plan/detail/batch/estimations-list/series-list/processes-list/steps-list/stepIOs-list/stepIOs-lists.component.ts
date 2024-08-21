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
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { StepService } from 'app/modules/admin/step/step.service';
import { ConsumptionIOsResultComponent } from './consumption-io/consumption-io.component';
import { QuantityIOsResultComponent } from './quantity-io/quantity-io.component';

@Component({
    selector: 'stepIOs-list',
    templateUrl: 'stepIOs-list.component.html',
    styleUrls: ['stepIOs-list.component.css'],
    standalone: true,
    imports: [
        MatIconModule,
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
    ],
})
export class StepIOsListComponent implements OnInit {
    createStepResultForm: UntypedFormGroup;
    stepIOsList: IORespone;
    totalIO: number = 0;
    addedQuantity: number = 0;
    addedConsumption: number = 0;
    inputOutputResults: InputOutputResult[] = [];
    constructor(
        private _formBuilder: UntypedFormBuilder,
        public matDialogRef: MatDialogRef<StepIOsListComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            seriesId: string;
            stepIOsList: IORespone;
            stepId: string;
        },
        private _stepService: StepService,
        private _dialog: MatDialog
    ) {}

    ngOnInit() {
        console.log(this.data.seriesId);
        if (this.data.stepIOsList.materials !== null) {
            const matIn = this.data.stepIOsList.materials.inputs.length;
            if (matIn > 0) {
                this.totalIO += matIn;
            }
            const matOut = this.data.stepIOsList.materials.outputs.length;
            if (matOut > 0) {
                this.totalIO += matOut;
            }
        }
        if (this.data.stepIOsList.semiFinishProducts !== null) {
            const semiIn =
                this.data.stepIOsList.semiFinishProducts.inputs.length;
            if (semiIn > 0) {
                this.totalIO += semiIn;
            }
            const semiOut =
                this.data.stepIOsList.semiFinishProducts.outputs.length;
            if (semiOut > 0) {
                this.totalIO += semiOut;
            }
        }
        if (this.data.stepIOsList.products !== null) {
            const proIn = this.data.stepIOsList.products.inputs.length;
            if (proIn > 0) {
                this.totalIO += proIn;
            }
            const proOut = this.data.stepIOsList.products.outputs.length;
            if (proOut > 0) {
                this.totalIO += proOut;
            }
        }

        console.log(this.totalIO);

        this.stepIOsList = this.data.stepIOsList;
        console.log(this.stepIOsList);
        this.initStepResultForm();
    }

    initStepResultForm() {
        this.createStepResultForm = this._formBuilder.group({
            stepId: [this.data.stepId, [Validators.required]],
            description: 'Sản xuất như cc',
            inputOutputResults: [[], [Validators.required]],
        });
    }

    openQuantityIOResultsDialog(id: string) {
        this.checkStepIOHaveResult(id);
        const data = {
            id: id,
            addedQuantity: this.addedQuantity,
        };
        this._dialog
            .open(QuantityIOsResultComponent, {
                width: '400px',
                data: data,
            })
            .afterClosed()
            .subscribe((result) => {
                if (result && result.status == 'success') {
                    console.log(result.data);
                    this.inputOutputResults.push(result.data);
                    this.createStepResultForm.controls[
                        'inputOutputResults'
                    ].setValue(this.inputOutputResults);
                    console.log(this.createStepResultForm.value);
                }
            });
    }

    openConsumptionIOResultsDialog(id: string) {
        this.checkStepIOHaveResult(id);
        const data = {
            id: id,
            addedConsumption: this.addedConsumption,
        };
        this._dialog
            .open(ConsumptionIOsResultComponent, {
                width: '400px',
                data: data,
            })
            .afterClosed()
            .subscribe((result) => {
                if (result && result.status == 'success') {
                    console.log(result.data);
                    this.inputOutputResults.push(result.data);
                    this.createStepResultForm.controls[
                        'inputOutputResults'
                    ].setValue(this.inputOutputResults);
                    console.log(this.createStepResultForm.value);
                    this.addedConsumption = 0;
                }
            });
    }

    submit() {
        if (this.createStepResultForm.valid) {
            this._stepService
                .createStepResult(
                    this.data.seriesId,
                    this.createStepResultForm.value
                )
                .subscribe({
                    next: () => {
                        this.matDialogRef.close('success');
                    },
                });
        }
    }

    checkStepIOHaveResult(id: string) {
        const matchingResult = this.inputOutputResults.find(
            (item) => item.stepInputOutputId === id
        );
        if (matchingResult) {
            if (matchingResult.consumption) {
                this.addedConsumption = matchingResult.consumption;
            }
            if (matchingResult.quantity) {
                this.addedQuantity = matchingResult.quantity;
            }
        } else {
            this.addedConsumption = 0;
            this.addedQuantity = 0;
        }
    }
}
