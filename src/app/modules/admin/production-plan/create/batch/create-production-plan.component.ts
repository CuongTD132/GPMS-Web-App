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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProductionPlanService } from '../../production-plan.service';
import { EstimationComponent } from './estimation/estimation.component';
@Component({
    selector: 'create-batch-production-plan',
    standalone: true,
    templateUrl: './create-production-plan.component.html',
    styleUrls: ['./create-production-plan.component.css'],
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
        MatCheckboxModule,
    ],
})
export class CreateBatchProductionPlanComponent implements OnInit {
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    createProductionPlanForm: UntypedFormGroup;
    addProductionRequirementForm: UntypedFormGroup;
    productionRequirements: any[] = [];
    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: any,
        private _dialog: MatDialog,
        public matDialogRef: MatDialogRef<CreateBatchProductionPlanComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _productionPlanService: ProductionPlanService
    ) {}

    ngOnInit(): void {
        this.initProductionPlanForm();
        this.initProductionRequirementForm();
    }
    initProductionPlanForm() {
        this.createProductionPlanForm = this._formBuilder.group({
            parentProductionPlanId: this.data.parentId,
            name: [
                'Kế hoạch sản xuất ENCORE JEANS V6017 batch số 1',
                [Validators.required],
            ],
            code: ['BATCH-PLAN00', [Validators.required]],
            expectedStartingDate: ['2024-09-01', [Validators.required]],
            dueDate: ['2024-09-07', [Validators.required]],
            type: ['Batch', [Validators.required]],
            description: [
                'Lên kế hoạch sản xuất ENCORE JEANS V6017 từ 2024-09-01 đến 2024-09-07',
                [Validators.required],
            ],
            productionRequirements: [[], [Validators.required]],
        });
    }

    initProductionRequirementForm() {
        this.addProductionRequirementForm = this._formBuilder.group({
            productionSpecificationId: [null, Validators.required],
            quantity: [null, Validators.required],
            productionEstimations: [[], [Validators.required]],
        });
    }

    createProductionPlan() {
        console.log(this.createProductionPlanForm);

        if (this.createProductionPlanForm.valid) {
            this._productionPlanService
                .createChildProductionPlan(this.createProductionPlanForm.value)
                .subscribe({
                    next: (result: any) => {
                        console.log(result);

                        this.matDialogRef.close('success');
                    },
                    // error: (err) => {},
                });
        }
    }
    add(item: Reqs[]) {
        this._dialog
            .open(EstimationComponent, {
                data: item,
                width: '720px',
            })
            .afterClosed()
            .subscribe((result) => {
                if (result.status == 'success') {
                    this.productionRequirements.push(result.data);
                    this.createProductionPlanForm.controls[
                        'productionRequirements'
                    ].setValue(this.productionRequirements);
                    console.log(this.createProductionPlanForm.value);
                }
            });
    }
}
