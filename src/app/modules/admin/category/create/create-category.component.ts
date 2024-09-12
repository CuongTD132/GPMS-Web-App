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
    selector: 'create-category',
    standalone: true,
    templateUrl: './create-category.component.html',
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
export class CreateCategoryComponent implements OnInit {
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    createCategoryForm: UntypedFormGroup;

    constructor(
        public matDialogRef: MatDialogRef<CreateCategoryComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _categoryService: CategoryService
    ) {}

    ngOnInit(): void {
        this.initCategoryForm();
    }
    logForm() {
        console.log(this.createCategoryForm.value);
    }
    initCategoryForm() {
        this.createCategoryForm = this._formBuilder.group({
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            consumptionUnit: [null, [Validators.required]],
            sizeWidthUnit: [null, [Validators.required]],
            colorCode: [null, [Validators.required]],
            colorName: [null, [Validators.required]],
            description: null,
            isNew: [true],
        });
    }

    createCategory() {
        if (this.createCategoryForm.valid) {
            this._categoryService
                .createCategory(this.createCategoryForm.value)
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
}
