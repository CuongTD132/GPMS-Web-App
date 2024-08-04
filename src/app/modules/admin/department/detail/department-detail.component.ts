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
import { DepartmentService } from '../department.service';

@Component({
    selector: 'department-detail',
    standalone: true,
    templateUrl: './department-detail.component.html',
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
export class DepartmentDetailComponent implements OnInit {
    department: DepartmentDetail;
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    updateDepartmentForm: UntypedFormGroup;

    constructor(
        public matDialogRef: MatDialogRef<DepartmentDetailComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _departmentService: DepartmentService
    ) {}

    ngOnInit(): void {
        this._departmentService._departmentInfo$.subscribe((department) => {
            this.department = department;
            this.initDepartmentForm();
        });
    }

    initDepartmentForm() {
        this.updateDepartmentForm = this._formBuilder.group({
            name: [this.department.name, [Validators.required]],
            staffs: this._formBuilder.group({
                code: [null, [Validators.required]],
                fullName: [null, [Validators.required]],
                position: [null, [Validators.required]],
                status: [null, [Validators.required]],
            }),
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

    // updateDepartment() {
    //     this._departmentService
    //         .updateDepartment(
    //             this.department.id,
    //             this.updateDepartmentForm.value
    //         )
    //         .subscribe({
    //             next: (result) => {
    //                 this.matDialogRef.close('success');
    //             },
    //             error: (err) => {
    //                 this.matDialogRef.close('error');
    //             },
    //             // complete: () => console.log('There are no more action happen.')
    //         });
    // }
    // updateDepartment() {
    //     if (this.updateDepartmentForm.valid) {
    //         const formData = new FormData();
    //         for (const key in this.updateDepartmentForm.controls) {
    //             if (this.updateDepartmentForm.controls.hasOwnProperty(key)) {
    //                 formData.append(
    //                     key,
    //                     this.updateDepartmentForm.controls[key].value
    //                 );
    //             }
    //         }
    //         if (this.selectedFile) {
    //             formData.append('thumbnail', this.selectedFile);
    //         }
    //         this._departmentService
    //             .updateDepartment(this.department.id, formData)
    //             .subscribe({
    //                 next: (department) => {
    //                     if (department) {
    //                         this.matDialogRef.close('success');
    //                     }
    //                 },
    //             });
    //     }
    // }
}
