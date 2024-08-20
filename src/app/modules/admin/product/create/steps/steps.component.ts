import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MaterialService } from 'app/modules/admin/material/material.service';
import { StepIOsComponent } from './stepIOs/stepIOs.component';

@Component({
    selector: 'create-steps',
    standalone: true,
    templateUrl: './steps.component.html',
    styleUrls: ['./steps.component.css'],

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
export class StepsComponent implements OnInit {
    stepForm: UntypedFormGroup;
    addedStepForm: UntypedFormGroup;
    addedSteps: Steps[] = [];
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            semi: SemiFinishedProduct[];
            boMs: NewBillOfMaterial[];
        },
        public matDialogRef: MatDialogRef<StepsComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _dialog: MatDialog,
        private _materialService: MaterialService
    ) {}
    ngOnInit(): void {
        this.initStepForm();
        this.initAddedStepForm();
    }

    initStepForm() {
        this.stepForm = this._formBuilder.group({
            code: [null, [Validators.required]],
            name: [null, [Validators.required]],
            orderNumber: [null, [Validators.required]],
            standardTime: [null, [Validators.required]],
            outputPerHour: [null, [Validators.required]],
            description: null,
            stepIOs: [],
        });
    }

    initAddedStepForm() {
        this.addedStepForm = this._formBuilder.group({
            code: [null, [Validators.required]],
            name: [null, [Validators.required]],
            orderNumber: [null, [Validators.required]],
            standardTime: [null, [Validators.required]],
            outputPerHour: [null, [Validators.required]],
            description: null,
            stepIOs: [[], [Validators.required]],
        });
    }

    addValueToStepArray() {
        if (this.stepForm.valid) {
            const step: Steps = this.stepForm.value;
            this.addedSteps.push(step);
            this.initStepForm();
        }
    }

    disableButton() {
        return !this.stepForm.valid;
    }

    submit() {
        this.matDialogRef.close({
            status: 'success',
            data: this.addedStepForm.value,
        });
    }

    openStepIOsDialog(item: Step) {
        this._materialService.getMaterials().subscribe((materials) => {
            const data = {
                item,
                semiBomsList: this.data,
                materials: materials.data,
            };

            this._dialog
                .open(StepIOsComponent, {
                    width: '480px',
                    data: data,
                })
                .afterClosed()
                .subscribe((result) => {
                    if (result && result.status == 'success') {
                        // this.stepForm.setValue(result.data);
                        this.addedStepForm.setValue(result.data);
                    }
                });
        });
    }
}
