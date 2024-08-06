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
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '../product.service';
import { ProcessDetailComponent } from './process-detail/process-detail.component';
import { SpecificationDetailComponent } from './specification-detail/specification-detail.component';

@Component({
    selector: 'product-detail',
    standalone: true,
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css'],
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
        MatChipsModule,
    ],
})
export class ProductDetailComponent implements OnInit {
    product: Product;
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    updateProductForm: UntypedFormGroup;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _productService: ProductService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._productService.product$.subscribe((product) => {
            this.product = product;
            this.initProductForm();
        });
    }

    initProductForm() {
        this.updateProductForm = this._formBuilder.group({
            name: [this.product.name, [Validators.required]],
            code: [this.product.code, [Validators.required]],
            // consumptionUnit: [
            //     this.product.consumptionUnit,
            //     [Validators.required],
            // ],
            // sizeWidthUnit: [this.product.sizeWidthUnit, [Validators.required]],
            // colorCode: [this.product.colorCode, [Validators.required]],
            // colorName: [this.product.colorName, [Validators.required]],
            // description: [this.product.description],
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

    updateProduct() {}
    // updateProduct() {
    //     if (this.updateProductForm.valid) {
    //         const formData = new FormData();
    //         for (const key in this.updateProductForm.controls) {
    //             if (this.updateProductForm.controls.hasOwnProperty(key)) {
    //                 formData.append(
    //                     key,
    //                     this.updateProductForm.controls[key].value
    //                 );
    //             }
    //         }
    //         if (this.selectedFile) {
    //             formData.append('thumbnail', this.selectedFile);
    //         }
    //         this._productService
    //             .updateProduct(this.product.id, formData)
    //             .subscribe({
    //                 next: (product) => {
    //                     if (product) {
    //                         this.matDialogRef.close('success');
    //                     }
    //                 },
    //             });
    //     }
    // }

    openSpecificationDetailDialog(specification: Specification) {
        this._dialog
            .open(SpecificationDetailComponent, {
                width: '680px',
                data: specification,
            })
            .afterClosed()
            .subscribe();
    }

    openProcessDetailDialog(process: Process) {
        this._dialog
            .open(ProcessDetailComponent, {
                width: '680px',
                data: process,
            })
            .afterClosed()
            .subscribe();
    }
}
