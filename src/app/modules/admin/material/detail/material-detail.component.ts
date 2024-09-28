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
    selector: 'material-detail',
    standalone: true,
    templateUrl: './material-detail.component.html',
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
export class MaterialDetailComponent implements OnInit {
    material: Material;
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    updateMaterialForm: UntypedFormGroup;

    constructor(
        public matDialogRef: MatDialogRef<MaterialDetailComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _materialService: MaterialService
    ) {}

    ngOnInit(): void {
        this._materialService.material$.subscribe((material) => {
            this.material = material;
            this.initMaterialForm();
        });
    }

    initMaterialForm() {
        this.updateMaterialForm = this._formBuilder.group({
            name: [this.material.name, [Validators.required]],
            code: [this.material.code, [Validators.required]],
            consumptionUnit: [
                this.material.consumptionUnit,
                [Validators.required],
            ],
            sizeWidthUnit: [this.material.sizeWidthUnit, [Validators.required]],
            colorCode: [this.material.colorCode, [Validators.required]],
            colorName: [this.material.colorName, [Validators.required]],
            description: [this.material.description],
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

    updateMaterial() {
        this._materialService
            .updateMaterial(this.material.id, this.updateMaterialForm.value)
            .subscribe({
                next: (result) => {
                    this.matDialogRef.close('success');
                },
                error: (err) => {
                    this.matDialogRef.close('error');
                },
                // complete: () => //console.log('There are no more action happen.')
            });
    }
    // updateMaterial() {
    //     if (this.updateMaterialForm.valid) {
    //         const formData = new FormData();
    //         for (const key in this.updateMaterialForm.controls) {
    //             if (this.updateMaterialForm.controls.hasOwnProperty(key)) {
    //                 formData.append(
    //                     key,
    //                     this.updateMaterialForm.controls[key].value
    //                 );
    //             }
    //         }
    //         if (this.selectedFile) {
    //             formData.append('thumbnail', this.selectedFile);
    //         }
    //         this._materialService
    //             .updateMaterial(this.material.id, formData)
    //             .subscribe({
    //                 next: (material) => {
    //                     if (material) {
    //                         this.matDialogRef.close('success');
    //                     }
    //                 },
    //             });
    //     }
    // }
}
