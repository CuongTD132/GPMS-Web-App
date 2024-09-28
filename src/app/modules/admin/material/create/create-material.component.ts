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
import { MaterialService } from '../material.service';

@Component({
    selector: 'create-material',
    standalone: true,
    templateUrl: './create-material.component.html',
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
export class CreateMaterialComponent implements OnInit {
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    createMaterialForm: UntypedFormGroup;

    constructor(
        public matDialogRef: MatDialogRef<CreateMaterialComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _materialService: MaterialService
    ) {}

    ngOnInit(): void {
        this.initMaterialForm();
    }
    logForm() {
        //console.log(this.createMaterialForm.value);
    }
    initMaterialForm() {
        this.createMaterialForm = this._formBuilder.group({
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            consumptionUnit: [null, [Validators.required]],
            sizeWidthUnit: [null, [Validators.required]],
            colorCode: [null, [Validators.required]],
            colorName: [null, [Validators.required]],
            description: null,
            isNew: true,
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

    createMaterial() {
        if (this.createMaterialForm.valid) {
            this._materialService
                .createMaterial(this.createMaterialForm.value)
                .subscribe({
                    next: (result) => {
                        this.matDialogRef.close('success');
                    },
                    error: (err) => {
                        // this.matDialogRef.close('error');
                    },
                });
        }
    }
    // createMaterial() {
    //     if (this.createMaterialForm.valid) {
    //         const formData = new FormData();
    //         for (const key in this.createMaterialForm.controls) {
    //             if (this.createMaterialForm.controls.hasOwnProperty(key)) {
    //                 formData.append(
    //                     key,
    //                     this.createMaterialForm.controls[key].value
    //                 );
    //             }
    //         }
    //         if (this.selectedFile) {
    //             formData.append('thumbnail', this.selectedFile);
    //         }
    //         this._materialService.createMaterial(formData).subscribe({
    //             next: (material) => {
    //                 if (material) {
    //                     this.matDialogRef.close('success');
    //                 }
    //             },
    //         });
    //     }
    // }
}
