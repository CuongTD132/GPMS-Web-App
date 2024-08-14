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
export class CreateMonthProductionPlanComponent implements OnInit {
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    createProductionPlanForm: UntypedFormGroup;
    addProductionRequirementForm: UntypedFormGroup;
    addProductionEstimationForm: UntypedFormGroup;
    currentDay: string;
    productionRequirements: any[] = [];
    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: any,
        private _dialog: MatDialog,
        public matDialogRef: MatDialogRef<CreateMonthProductionPlanComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _productionPlanService: ProductionPlanService
    ) {}

    ngOnInit(): void {
        this.data;
        console.log(this.data.item);
        this.initProductionPlanForm();
        this.initProductionRequirementForm();
        this.initProductionEstimationForm();
    }
    logForm() {
        console.log(this.createProductionPlanForm.value);
    }
    initProductionPlanForm() {
        this.createProductionPlanForm = this._formBuilder.group({
            parentProductionPlanId: this.data.parentId,
            name: [
                'Kế hoạch sản xuất áo Men Shirt batch số 1',
                [Validators.required],
            ],
            code: ['BATCH-PRO-PLAN001', [Validators.required]],
            expectedStartingDate: ['2024-08-13', [Validators.required]],
            dueDate: ['2024-08-31', [Validators.required]],
            type: ['Month', [Validators.required]],
            description: [
                'Lên kế hoạch sản xuất áo Men Shirt từ 08-13-2024 đến 08-31-2024',
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

    initProductionEstimationForm() {
        this.addProductionEstimationForm = this._formBuilder.group({
            quantity: [200, Validators.required],
            overTimeQuantity: [250, Validators.required],
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

    toggleSelection(event: any, id: string) {
        console.log(id);

        console.log(event.checked);
    }

    add(item: Specification) {
        const data = { item, quantity: this.data.item };
        this._dialog
            .open(EstimationComponent, {
                data: item,
                width: '720px',
            })
            .afterClosed()
            .subscribe((result) => {
                console.log(result);
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
