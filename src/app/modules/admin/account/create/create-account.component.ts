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
import { Observable } from 'rxjs';
import { DepartmentService } from '../../department/department.service';
import { AccountService } from '../account.service';

@Component({
    selector: 'create-account',
    standalone: true,
    templateUrl: './create-account.component.html',
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
export class CreateAccountComponent implements OnInit {
    departments$: Observable<Department[]>;
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    createAccountForm: UntypedFormGroup;
    showDepartment = true;
    constructor(
        private _departmentService: DepartmentService,
        public matDialogRef: MatDialogRef<CreateAccountComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _accountService: AccountService
    ) {}

    ngOnInit(): void {
        this.departments$ = this._departmentService.departments$;
        this.initAccountForm();
        this.logForm();
    }

    logForm() {
        console.log(this.createAccountForm.value);
    }

    initAccountForm() {
        let departmentId: string;
        this.departments$.subscribe((departments) => {
            departmentId = departments[0].id;
        });
        this.createAccountForm = this._formBuilder.group({
            code: [null, [Validators.required]],
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required]],
            personalInfo: this._formBuilder.group({
                fullName: [null, [Validators.required]],
                position: [2, [Validators.required]],
                departmentId: [departmentId, [Validators.required]],
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

    onPositionChange(event: any) {
        this.createAccountForm
            .get('personalInfo.position')
            .setValue(event.value);
        if (event.value === 1 || event.value === 2) {
            this.showDepartment = true;
        } else {
            this.showDepartment = false;
        }

        this.logForm();
    }
    onDepartmentChange(event: any) {
        this.createAccountForm
            .get('personalInfo.departmentId')
            .setValue(event.value);
        this.logForm();
    }

    createAccount() {
        this._accountService
            .createAccount(this.createAccountForm.value)
            .subscribe({
                next: (result) => {
                    this.matDialogRef.close('success');
                },
                error: (err) => {
                    // this.matDialogRef.close('error');
                },
                // complete: () => console.log('There are no more action happen.')
            });
    }
}
