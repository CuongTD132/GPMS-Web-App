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
    selector: 'account-detail',
    standalone: true,
    templateUrl: './account-detail.component.html',
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
export class AccountDetailComponent implements OnInit {
    account: AccountInfo;
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    updateAccountForm: UntypedFormGroup;

    constructor(
        public matDialogRef: MatDialogRef<AccountDetailComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _accountService: AccountService
    ) {}

    ngOnInit(): void {
        this._accountService.accountInfo$.subscribe((account) => {
            this.account = account;
            this.initAccountForm();
        });
    }
    initAccountForm() {
        const i = this.account.createdDate.indexOf('T');
        const formatedDate = this.account.createdDate.substring(0, i);
        this.updateAccountForm = this._formBuilder.group({
            code: [
                { value: this.account.code, disabled: true },
                [Validators.required],
            ],
            fullName: [
                { value: this.account.fullName, disabled: true },
                [Validators.required],
            ],
            email: [
                { value: this.account.email, disabled: true },
                [Validators.required],
            ],
            position: [
                { value: this.account.position, disabled: true },
                [Validators.required],
            ],
            status: [
                { value: this.account.status, disabled: true },
                [Validators.required],
            ],
            createdDate: [
                { value: formatedDate, disabled: true },
                [Validators.required],
            ],
        });
    }

    onAccountStatusChange(event: any) {
        this.updateAccountForm.get('status').setValue(event.value);
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
    updateAccount() {
        this._accountService
            .updateAccount(this.account.id, this.updateAccountForm.value)
            .subscribe({
                next: (result) => {
                    this.matDialogRef.close('success');
                },
                error: (err) => {
                    this.matDialogRef.close('error');
                },
            });
    }
    // updateAccount() {
    //     if (this.updateAccountForm.valid) {
    //         const formData = new FormData();
    //         for (const key in this.updateAccountForm.controls) {
    //             if (this.updateAccountForm.controls.hasOwnProperty(key)) {
    //                 formData.append(
    //                     key,
    //                     this.updateAccountForm.controls[key].value
    //                 );
    //             }
    //         }
    //         if (this.selectedFile) {
    //             formData.append('thumbnail', this.selectedFile);
    //         }
    //         this._accountService
    //             .updateAccount(this.account.id, formData)
    //             .subscribe({
    //                 next: (account) => {
    //                     if (account) {
    //                         this.matDialogRef.close('success');
    //                     }
    //                 },
    //             });
    //     }
    // }
}
