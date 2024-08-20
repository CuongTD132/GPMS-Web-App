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
import { MaterialService } from '../../material/material.service';
import { ProductService } from '../product.service';
import { BomsComponent } from './boms/boms.component';
import { MeasurementsComponent } from './measurements/measurements.component';
import { QualityStandardsComponent } from './qualityStandards/qualityStandards.component';
import { StepsComponent } from './steps/steps.component';

@Component({
    selector: 'create-product',
    standalone: true,
    templateUrl: './create-product.component.html',
    styleUrls: ['./create-product.component.css'],

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
    createProductForm: UntypedFormGroup;
    semiFinishedProductForm: UntypedFormGroup;
    specificationForm: UntypedFormGroup;
    processForm: UntypedFormGroup;
    categories: Category[];
    materialList: Material[] = [];
    semiFinishedProducts: SemiFinishedProduct[] = [];
    processes: Process[] = [];
    specifications: NewSpecification[] = [];
    measurements: Measurement[] = [];
    boMs: NewBillOfMaterial[] = [];
    steps: Step[] = [];
    qualityStandards: QualityStandard[] = [];
    materials: Material[];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Category[],
        public matDialogRef: MatDialogRef<CreateProductComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _productService: ProductService,
        private _dialog: MatDialog,
        private _materialService: MaterialService
    ) {}

    ngOnInit(): void {
        this.initProductForm();
        this.initSemiFinishedProductForm();
        this.initProcessForm();
        this.initSpecificationForm();
    }

    initProductForm() {
        this.createProductForm = this._formBuilder.group({
            name: ['Áo Zues', [Validators.required]],
            code: ['AOZUES01', [Validators.required]],
            sizes: ['S, M, L, XL', [Validators.required]],
            colors: ['Đỏ, Cam, Vàng', [Validators.required]],
            description: 'Áo Zues thần kỳ với các màu sắc sỡ',
            categoryId: ['none', [Validators.required]],
            semiFinishedProducts: [[], [Validators.required]],
            specifications: [[], [Validators.required]],
            processes: [[], [Validators.required]],
        });
    }

    initSemiFinishedProductForm() {
        this.semiFinishedProductForm = this._formBuilder.group({
            name: ['Cổ áo', [Validators.required]],
            code: ['CoAo01', [Validators.required]],
            quantity: [2, [Validators.required]],
            description: null,
        });
    }

    initSpecificationForm() {
        this.specificationForm = this._formBuilder.group({
            size: ['XL', [Validators.required]],
            color: ['Đỏ', [Validators.required]],
            measurements: [[], [Validators.required]],
            boMs: [[], [Validators.required]],
            qualityStandards: [[], [Validators.required]],
        });
    }

    initProcessForm() {
        this.processForm = this._formBuilder.group({
            code: ['AOZUES01PROCESS001', [Validators.required]],
            name: ['Cắt', [Validators.required]],
            orderNumber: [1, [Validators.required]],
            description: null,
            steps: [[], [Validators.required]],
        });
    }

    createProduct() {
        console.log(this.createProductForm.value);

        this._productService
            .createProduct(this.createProductForm.value)
            .subscribe({
                next: (result) => {
                    this.matDialogRef.close('success');
                },
            });
    }

    addValueToSemiFinishedProductArray() {
        if (this.semiFinishedProductForm.valid) {
            const semiFinishedProduct: SemiFinishedProduct =
                this.semiFinishedProductForm.value;
            this.semiFinishedProducts.push(semiFinishedProduct);
            this.semiFinishedProductForm.reset();
            this.createProductForm.controls['semiFinishedProducts'].setValue(
                this.semiFinishedProducts
            );
            console.log(this.createProductForm.value);
        }
    }

    openMeasurementsDialog() {
        this._dialog
            .open(MeasurementsComponent, {
                width: '720px',
            })
            .afterClosed()
            .subscribe((result) => {
                if (result && result.status == 'success') {
                    console.log(result.data);
                    this.specificationForm.controls['measurements'].setValue(
                        result.data
                    );
                    console.log(this.specificationForm.value);
                }
            });
    }

    openBomsDialog() {
        this._materialService.getMaterials().subscribe((material) => {
            this._dialog
                .open(BomsComponent, {
                    width: '1080px',
                    data: material.data,
                })
                .afterClosed()
                .subscribe((result) => {
                    console.log(result);
                    if (result && result.status == 'success') {
                        this.boMs = result.data;

                        this.specificationForm.controls['boMs'].setValue(
                            result.data
                        );
                        this.getSelectedMaterial();
                    }
                });
        });
    }

    getSelectedMaterial() {
        this._materialService.getMaterials().subscribe((materials) => {
            if (materials) {
                const matIdUniqueArr: string[] = [];
                this.boMs.forEach((bom) => {
                    if (!matIdUniqueArr.includes(bom.materialId)) {
                        matIdUniqueArr.push(bom.materialId);
                    }
                });
                const materialListReturn = materials.data.filter((material) =>
                    matIdUniqueArr.includes(material.id)
                );
                this.materialList = materialListReturn;
                return this.materialList;
            }
        });
    }

    openQualityStandardsDialog() {
        if (this.materialList && this.materialList.length > 0) {
            console.log(this.materialList);

            this._dialog
                .open(QualityStandardsComponent, {
                    width: '1080px',
                    data: this.materialList,
                })
                .afterClosed()
                .subscribe((result) => {
                    console.log(result);
                    if (result && result.status == 'success') {
                        this.specificationForm.controls[
                            'qualityStandards'
                        ].setValue(result.data);
                        console.log(this.specificationForm.value);
                    }
                });
        }
    }

    addValueToSpecificationArray() {
        console.log(this.specificationForm.value);

        if (this.specificationForm.valid) {
            const specification: NewSpecification =
                this.specificationForm.value;
            this.specifications.push(specification);
            this.specificationForm.reset();
            this.createProductForm.controls['specifications'].setValue(
                this.specifications
            );
            console.log(this.createProductForm.value);
        }
    }

    addValueToProcessArray() {
        if (this.processForm.valid) {
            const process: Process = this.processForm.value;
            this.processes.push(process);
            this.processForm.reset();
            this.createProductForm.controls['processes'].setValue(
                this.processes
            );
            console.log(this.createProductForm.value);
        }
    }

    openStepsDialog() {
        const data = { semi: this.semiFinishedProducts, boMs: this.boMs };
        this._dialog
            .open(StepsComponent, {
                width: '1280px',
                data: data,
            })
            .afterClosed()
            .subscribe((result) => {
                console.log(result);
                if (result && result.status == 'success') {
                    const steps: Steps[] = [];
                    steps.push(result.data);
                    this.processForm.controls['steps'].setValue(steps);
                    console.log(this.processForm.value);
                }
            });
    }
}
