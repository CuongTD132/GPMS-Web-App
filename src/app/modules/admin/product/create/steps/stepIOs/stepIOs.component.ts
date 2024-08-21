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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MaterialService } from 'app/modules/admin/material/material.service';

enum Type {
    Input = 'Input',
    Output = 'Output',
}
@Component({
    selector: 'create-stepIOs',
    standalone: true,
    templateUrl: './stepIOs.component.html',
    styleUrls: ['./stepIOs.component.css'],

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
        MatRadioModule,
    ],
})
export class StepIOsComponent implements OnInit {
    category: string = 'Material';
    categories: string[] = ['Material', 'Product', 'Semi'];
    type: Type = Type.Input;
    types = Object.values(Type);
    semiList: SemiFinishedProduct[] = this.data.semiBomsList.semi;
    materialList: Material[] = [];
    stepIOForm: UntypedFormGroup;
    addedSemiList: any[] = [];
    addedMaterialList: any[] = [];
    addedProductList: any[] = [];
    matForm: UntypedFormGroup;
    proForm: UntypedFormGroup;
    semiForm: UntypedFormGroup;
    stepIOs: StepIOs[] = [];
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            item: Steps;
            semiBomsList: {
                semi: SemiFinishedProduct[];
                boMs: NewBillOfMaterial[];
            };
            materials: Material[];
        },
        public matDialogRef: MatDialogRef<StepIOsComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _materialService: MaterialService
    ) {}
    ngOnInit(): void {
        this.initMatForm();
        this.initProForm();
        this.initSemiForm();
        this.getSelectedMaterial();
    }

    initMatForm() {
        this.matForm = this._formBuilder.group({
            consumption: [null, [Validators.required]],
            materialId: ['none', [Validators.required]],
            type: ['Input', [Validators.required]],
            isProduct: false,
        });
    }

    initProForm() {
        this.proForm = this._formBuilder.group({
            quantity: [null, [Validators.required]],
            type: ['Input', [Validators.required]],
            isProduct: true,
        });
    }

    initSemiForm() {
        this.semiForm = this._formBuilder.group({
            semiFinishedProductCode: ['none', [Validators.required]],
            quantity: [null, [Validators.required]],
            isProduct: false,
            type: ['Input', [Validators.required]],
        });
    }

    getMaterialName(id: string) {
        if (this.materialList.length > 0) {
            for (let i = 0; i < this.data.materials.length; i++) {
                if (this.data.materials[i].id === id) {
                    return this.data.materials[i].name;
                }
            }
            return null;
        }
    }

    getSelectedMaterial() {
        const boms = this.data.semiBomsList.boMs;
        const matIdUniqueArr: string[] = [];
        boms.forEach((bom) => {
            if (!matIdUniqueArr.includes(bom.materialId)) {
                matIdUniqueArr.push(bom.materialId);
            }
        });
        const materialListReturn = this.data.materials.filter((material) =>
            matIdUniqueArr.includes(material.id)
        );
        this.materialList = materialListReturn;
    }

    addSemiValueToStepArray() {
        if (
            this.semiForm.valid &&
            this.semiForm.get('semiFinishedProductCode').value !== 'none'
        ) {
            const stepIO: StepIOs = this.semiForm.value;
            this.stepIOs.push(stepIO);
            this.addedSemiList.push(stepIO);
            this.semiForm.reset();
            this.initSemiForm();
        }
    }
    addProValueToStepArray() {
        console.log(this.proForm.value);

        if (this.proForm.valid) {
            const stepIO: StepIOs = this.proForm.value;
            this.stepIOs.push(stepIO);
            this.addedProductList.push(stepIO);
            this.proForm.reset();
            this.initProForm();
        }
    }
    addMatValueToStepArray() {
        console.log(this.matForm.value);

        if (
            this.matForm.valid &&
            this.matForm.get('materialId').value !== 'none'
        ) {
            const stepIO: StepIOs = this.matForm.value;
            this.stepIOs.push(stepIO);
            this.addedMaterialList.push(stepIO);
            this.matForm.reset();
            this.initMatForm();
        }
    }
    submit() {
        const steps: Steps = {
            code: this.data.item.code,
            name: this.data.item.name,
            orderNumber: this.data.item.orderNumber,
            standardTime: this.data.item.standardTime,
            outputPerHour: this.data.item.outputPerHour,
            description: this.data.item.description,
            stepIOs: this.stepIOs,
        };
        console.log(steps);

        this.matDialogRef.close({
            status: 'success',
            data: steps,
        });
    }
}
