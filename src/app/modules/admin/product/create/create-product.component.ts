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
import { ProductService } from '../product.service';

@Component({
    selector: 'create-product',
    standalone: true,
    templateUrl: './create-product.component.html',
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
export class CreateProductComponent implements OnInit {
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    createProductForm: UntypedFormGroup;

    constructor(
        public matDialogRef: MatDialogRef<CreateProductComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _productService: ProductService
    ) {}

    ngOnInit(): void {
        this.initProductForm();
    }
    logForm() {
        console.log(this.createProductForm.value);
    }
    initProductForm() {
        this.createProductForm = this._formBuilder.group({
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

    createProduct() {
        this._productService
            .createProduct(this.createProductForm.value)
            .subscribe({
                next: (result) => {
                    this.matDialogRef.close('success');
                },
                error: (err) => {
                    this.matDialogRef.close('error');
                },
            });
    }
    // createProduct() {
    //     if (this.createProductForm.valid) {
    //         const formData = new FormData();
    //         for (const key in this.createProductForm.controls) {
    //             if (this.createProductForm.controls.hasOwnProperty(key)) {
    //                 formData.append(
    //                     key,
    //                     this.createProductForm.controls[key].value
    //                 );
    //             }
    //         }
    //         if (this.selectedFile) {
    //             formData.append('thumbnail', this.selectedFile);
    //         }
    //         this._productService.createProduct(formData).subscribe({
    //             next: (product) => {
    //                 if (product) {
    //                     this.matDialogRef.close('success');
    //                 }
    //             },
    //         });
    //     }
    // }
}
