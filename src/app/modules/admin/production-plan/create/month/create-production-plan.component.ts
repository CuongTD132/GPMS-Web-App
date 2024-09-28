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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductionPlanService } from '../../production-plan.service';
import { EstimationComponent } from './estimation/estimation.component';
@Component({
    selector: 'create-month-production-plan',
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
        MatTooltipModule,
    ],
})
export class CreateMonthProductionPlanComponent implements OnInit {
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    createProductionPlanForm: UntypedFormGroup;
    addProductionRequirementForm: UntypedFormGroup;
    addProductionEstimationForm: UntypedFormGroup;
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
        this.initProductionPlanForm();
        this.initProductionRequirementForm();
        this.initProductionEstimationForm();
    }
    initProductionPlanForm() {
        this.createProductionPlanForm = this._formBuilder.group({
            parentProductionPlanId: this.data.parentId,
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            expectedStartingDate: [null, [Validators.required]],
            dueDate: [null, [Validators.required]],
            type: ['Month', [Validators.required]],
            description: null,
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
        //console.log(this.createProductionPlanForm);

        if (this.createProductionPlanForm.valid) {
            this._productionPlanService
                .createChildProductionPlan(this.createProductionPlanForm.value)
                .subscribe({
                    next: () => {
                        this._productionPlanService
                            .getProductionPlanById(this.data.parentId)
                            .subscribe();
                        this.matDialogRef.close('success');
                    },
                    // error: (err) => {},
                });
        }
    }
    add(item: Specification) {
        this._dialog
            .open(EstimationComponent, {
                data: item,
                width: '720px',
            })
            .afterClosed()
            .subscribe((result) => {
                //console.log(result);
                if (result.status == 'success') {
                    this.productionRequirements.push(result.data);
                    this.createProductionPlanForm.controls[
                        'productionRequirements'
                    ].setValue(this.productionRequirements);
                    //console.log(this.createProductionPlanForm.value);
                }
            });
    }
}
