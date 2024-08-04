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
import { CategoryService } from '../category.service';

@Component({
    selector: 'category-detail',
    standalone: true,
    templateUrl: './category-detail.component.html',
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
export class CategoryDetailComponent implements OnInit {
    category: Category;
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    updateCategoryForm: UntypedFormGroup;

    constructor(
        public matDialogRef: MatDialogRef<CategoryDetailComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _categoryService: CategoryService
    ) {}

    ngOnInit(): void {
        this._categoryService.category$.subscribe((category) => {
            this.category = category;
            this.initCategoryForm();
        });
    }

    initCategoryForm() {
        this.updateCategoryForm = this._formBuilder.group({
            name: [this.category.name, [Validators.required]],
            // code: [this.category.code, [Validators.required]],
            // consumptionUnit: [
            //     this.category.consumptionUnit,
            //     [Validators.required],
            // ],
            // sizeWidthUnit: [this.category.sizeWidthUnit, [Validators.required]],
            // colorCode: [this.category.colorCode, [Validators.required]],
            // colorName: [this.category.colorName, [Validators.required]],
            // description: [this.category.description],
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

    updateCategory() {
        this._categoryService
            .updateCategory(this.category.id, this.updateCategoryForm.value)
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
    // updateCategory() {
    //     if (this.updateCategoryForm.valid) {
    //         const formData = new FormData();
    //         for (const key in this.updateCategoryForm.controls) {
    //             if (this.updateCategoryForm.controls.hasOwnProperty(key)) {
    //                 formData.append(
    //                     key,
    //                     this.updateCategoryForm.controls[key].value
    //                 );
    //             }
    //         }
    //         if (this.selectedFile) {
    //             formData.append('thumbnail', this.selectedFile);
    //         }
    //         this._categoryService
    //             .updateCategory(this.category.id, formData)
    //             .subscribe({
    //                 next: (category) => {
    //                     if (category) {
    //                         this.matDialogRef.close('success');
    //                     }
    //                 },
    //             });
    //     }
    // }
}
