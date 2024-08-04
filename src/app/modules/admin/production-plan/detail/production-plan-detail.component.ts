import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProductionPlanService } from '../production-plan.service';

@Component({
    selector: 'productionPlan-detail',
    standalone: true,
    templateUrl: './production-plan-detail.component.html',
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
export class ProductionPlanDetailComponent implements OnInit {
    productionPlan: ProductionPlan;
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    updateProductionPlanForm: UntypedFormGroup;

    constructor(
        public matDialogRef: MatDialogRef<ProductionPlanDetailComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _productionPlanService: ProductionPlanService
    ) {}

    ngOnInit(): void {
        this._productionPlanService.productionPlan$.subscribe(
            (productionPlan) => {
                this.productionPlan = productionPlan;
                this.initProductionPlanForm();
            }
        );
    }

    initProductionPlanForm() {
        this.updateProductionPlanForm = this._formBuilder.group({
            name: [this.productionPlan.name, [Validators.required]],
            code: [this.productionPlan.code, [Validators.required]],
            // consumptionUnit: [
            //     this.productionPlan.consumptionUnit,
            //     [Validators.required],
            // ],
            // sizeWidthUnit: [
            //     this.productionPlan.sizeWidthUnit,
            //     [Validators.required],
            // ],
            // colorCode: [this.productionPlan.colorCode, [Validators.required]],
            // colorName: [this.productionPlan.colorName, [Validators.required]],
            // description: [this.productionPlan.description],
        });
    }

    onFileSelected(event: Event): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewUrl = e.target?.result;
            };
            reader.readAsDataURL(file);
        }
    }

    updateProductionPlan() {
        this._productionPlanService
            .updateProductionPlan(
                this.productionPlan.id,
                this.updateProductionPlanForm.value
            )
            .subscribe({
                next: (result) => {
                    this.matDialogRef.close('success');
                },
                error: (err) => {
                    this.matDialogRef.close('error');
                },
                // complete: () => console.log('There are no more action happen.')
            });
    }
    // updateProductionPlan() {
    //     if (this.updateProductionPlanForm.valid) {
    //         const formData = new FormData();
    //         for (const key in this.updateProductionPlanForm.controls) {
    //             if (this.updateProductionPlanForm.controls.hasOwnProperty(key)) {
    //                 formData.append(
    //                     key,
    //                     this.updateProductionPlanForm.controls[key].value
    //                 );
    //             }
    //         }
    //         if (this.selectedFile) {
    //             formData.append('thumbnail', this.selectedFile);
    //         }
    //         this._productionPlanService
    //             .updateProductionPlan(this.productionPlan.id, formData)
    //             .subscribe({
    //                 next: (productionPlan) => {
    //                     if (productionPlan) {
    //                         this.matDialogRef.close('success');
    //                     }
    //                 },
    //             });
    //     }
    // }
}
