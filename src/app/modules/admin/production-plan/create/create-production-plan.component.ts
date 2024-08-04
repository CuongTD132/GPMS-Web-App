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
    selector: 'create-productionPlan',
    standalone: true,
    templateUrl: './create-production-plan.component.html',
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
export class CreateProductionPlanComponent implements OnInit {
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    createProductionPlanForm: UntypedFormGroup;

    constructor(
        public matDialogRef: MatDialogRef<CreateProductionPlanComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _productionPlanService: ProductionPlanService
    ) {}

    ngOnInit(): void {
        this.initProductionPlanForm();
    }
    logForm() {
        console.log(this.createProductionPlanForm.value);
    }
    initProductionPlanForm() {
        this.createProductionPlanForm = this._formBuilder.group({
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            consumptionUnit: [null, [Validators.required]],
            sizeWidthUnit: [null, [Validators.required]],
            colorCode: [null, [Validators.required]],
            colorName: [null, [Validators.required]],
            description: [null, [Validators.required]],
            isNew: [true],
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

    createProductionPlan() {
        this._productionPlanService
            .createProductionPlan(this.createProductionPlanForm.value)
            .subscribe({
                next: (result) => {
                    this.matDialogRef.close('success');
                },
                error: (err) => {
                    this.matDialogRef.close('error');
                },
            });
    }
    // createProductionPlan() {
    //     if (this.createProductionPlanForm.valid) {
    //         const formData = new FormData();
    //         for (const key in this.createProductionPlanForm.controls) {
    //             if (this.createProductionPlanForm.controls.hasOwnProperty(key)) {
    //                 formData.append(
    //                     key,
    //                     this.createProductionPlanForm.controls[key].value
    //                 );
    //             }
    //         }
    //         if (this.selectedFile) {
    //             formData.append('thumbnail', this.selectedFile);
    //         }
    //         this._productionPlanService.createProductionPlan(formData).subscribe({
    //             next: (productionPlan) => {
    //                 if (productionPlan) {
    //                     this.matDialogRef.close('success');
    //                 }
    //             },
    //         });
    //     }
    // }
}
