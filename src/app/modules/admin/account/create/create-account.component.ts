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
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    createAccountForm: UntypedFormGroup;

    constructor(
        public matDialogRef: MatDialogRef<CreateAccountComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _accountService: AccountService
    ) {}

    ngOnInit(): void {
        this.initAccountForm();
    }

    initAccountForm() {
        this.createAccountForm = this._formBuilder.group({
            name: [null, [Validators.required]],
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

    createAccount() {
        if (this.createAccountForm.valid) {
            const formData = new FormData();
            for (const key in this.createAccountForm.controls) {
                if (this.createAccountForm.controls.hasOwnProperty(key)) {
                    formData.append(
                        key,
                        this.createAccountForm.controls[key].value
                    );
                }
            }
            if (this.selectedFile) {
                formData.append('thumbnail', this.selectedFile);
            }
            this._accountService.createAccount(formData).subscribe({
                next: (account) => {
                    if (account) {
                        this.matDialogRef.close('success');
                    }
                },
            });
        }
    }
}
