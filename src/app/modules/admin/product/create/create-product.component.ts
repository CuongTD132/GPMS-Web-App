import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { MaterialService } from '../../material/material.service';
import { ProductService } from '../product.service';
import { BomsComponent } from './boms/boms.component';
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
        MatStepperModule,
        // NgxColorsModule,
    ],
})
export class CreateProductComponent implements OnInit {
    @ViewChild('stepperSpec') stepperSpec: MatStepper;
    createProductForm: UntypedFormGroup;
    firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required],
    });
    secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
    });
    semiFinishedProductForm: UntypedFormGroup;
    semiListForm: FormGroup;
    measurementForm: FormGroup;
    measurementsListForm: FormGroup;
    bomForm: FormGroup;
    bomsListForm: FormGroup;
    quaStandForm: FormGroup;
    quaStandsListForm: FormGroup;
    totalSemiRow: number;
    totalMeasureRow: number;
    totalBomRow: number;
    totalQuaStandRow: number;
    specificationForm: FormGroup;
    specificationsListForm: FormGroup;
    sizeForm: UntypedFormGroup;
    colorForm: UntypedFormGroup;
    processForm: UntypedFormGroup;
    categories: Category[];
    selectedMaterialsList: Material[] = [];
    semiFinishedProducts: SemiFinishedProduct[] = [];
    processes: Process[] = [];
    specifications: NewSpecification[] = [];
    measurements: Measurement[] = [];
    boMs: NewBillOfMaterial[] = [];
    steps: Step[] = [];
    materials: Material[];
    selectedMaterials: Material[] = [];
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private _productService: ProductService,
        private _dialog: MatDialog,
        private _materialService: MaterialService
    ) {}

    logGeneralForm(): void {
        console.log(this.createProductForm.value);
    }

    logSemiForm(): void {
        console.log(this.semiListForm.value);
    }

    logSpecForm(): void {
        console.log(this.specificationForm.value);
    }
    logSpecListForm(): void {
        const control = <FormArray>(
            this.specificationsListForm.controls['specifications']
        );
        control.push(this.specificationForm);
        console.log(this.specificationsListForm.value);
    }
    logMesureForm(): void {
        console.log(this.measurementsListForm.value);
    }

    logBomForm(): void {
        this.boMs = this.bomsListForm.controls.boMs.value;
        console.log(this.boMs);
        this.getSelectedMaterial();
    }

    logColorForm(): void {
        console.log(this.colorForm.value);
    }

    logSizeForm(): void {
        console.log(this.sizeForm.value);
        console.log(this.specificationsListForm.value);
    }

    logQuaStandForm(): void {
        console.log(this.quaStandsListForm.value);
        this.specificationForm.controls['sizeName'].setValue(
            this.sizeForm.controls.sizeName.value
        );
        this.specificationForm.controls['colorCode'].setValue(
            this.colorForm.controls.colorCode.value
        );
        this.specificationForm.controls['measurements'].setValue(
            this.measurementsListForm.controls.measurements.value
        );
        this.specificationForm.controls['boMs'].setValue(
            this.bomsListForm.controls.boMs.value
        );
        this.specificationForm.controls['qualityStandards'].setValue(
            this.quaStandsListForm.controls.qualityStandards.value
        );
        console.log(this.specificationForm.value);
    }

    logReset(): void {
        const control = <FormArray>(
            this.specificationsListForm.controls['specifications']
        );
        control.push(this.specificationForm);
        this.stepperSpec.reset();
    }

    ngOnInit(): void {
        this._activatedRoute.data.subscribe((data) => {
            this.categories = data['categories'].data;
            this.materials = data['materials'].data;
        });
        this.initProductForm();
        this.initSemiFinishedProductForm();
        this.initProcessForm();
        this.initSemiListForm();
        this.initMeasurementListForm();
        this.initBomListForm();
        this.initQuaStandListForm();
        this.initQuaStandForm();
        this.initSizeForm();
        this.initColorForm();
        this.initSpecificationListForm();
        this.initSpecificationForm();
    }

    initProductForm() {
        this.createProductForm = this._formBuilder.group({
            name: ['Áo thun', [Validators.required]],
            code: ['AOTHUN01', [Validators.required]],
            description: 'Áo Zues thần kỳ với các màu sắc sỡ',
            categoryId: [null, [Validators.required]],
            semiFinishedProducts: [],
            specifications: [],
            processes: [],
        });
    }

    initSemiListForm() {
        this.semiListForm = this._formBuilder.group({
            semiFinishedProducts: this._formBuilder.array([
                this.initSemiFinishedProductForm(),
            ]),
        });
    }
    initSemiFinishedProductForm() {
        return this._formBuilder.group({
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            quantity: [null, [Validators.required]],
            description: null,
        });
    }

    addNewSemiRow() {
        const control = <FormArray>(
            this.semiListForm.controls['semiFinishedProducts']
        );
        control.push(this.initSemiFinishedProductForm());
    }

    deleteSemiRow(i: number) {
        const control = <FormArray>(
            this.semiListForm.controls['semiFinishedProducts']
        );
        if (control !== null) {
            this.totalSemiRow = control.value.length;
        }
        if (this.totalSemiRow > 1) {
            control.removeAt(i);
        } else {
            return false;
        }
    }

    initMeasurementListForm() {
        this.measurementsListForm = this._formBuilder.group({
            measurements: this._formBuilder.array([this.initMeasurementForm()]),
        });
    }
    initMeasurementForm() {
        return this._formBuilder.group({
            name: [null, [Validators.required]],
            measure: [null, [Validators.required]],
            unit: [null, [Validators.required]],
        });
    }

    addNewMesureRow() {
        const control = <FormArray>(
            this.measurementsListForm.controls['measurements']
        );
        control.push(this.initMeasurementForm());
    }

    deleteMesureRow(i: number) {
        const control = <FormArray>(
            this.measurementsListForm.controls['measurements']
        );
        if (control !== null) {
            this.totalMeasureRow = control.value.length;
        }
        if (this.totalMeasureRow > 1) {
            control.removeAt(i);
        } else {
            return false;
        }
    }

    initQuaStandListForm() {
        this.quaStandsListForm = this._formBuilder.group({
            qualityStandards: this._formBuilder.array([
                this.initQuaStandForm(),
            ]),
        });
    }
    initQuaStandForm() {
        return this._formBuilder.group({
            name: [null, [Validators.required]],
            description: null,
            materialId: [null, [Validators.required]],
        });
    }

    addNewQuaStandRow() {
        const control = <FormArray>(
            this.quaStandsListForm.controls['qualityStandards']
        );
        control.push(this.initQuaStandForm());
    }

    deleteQuaStandRow(i: number) {
        const control = <FormArray>(
            this.quaStandsListForm.controls['qualityStandards']
        );
        if (control !== null) {
            this.totalQuaStandRow = control.value.length;
        }
        if (this.totalQuaStandRow > 1) {
            control.removeAt(i);
        } else {
            return false;
        }
    }

    initBomListForm() {
        this.bomsListForm = this._formBuilder.group({
            boMs: this._formBuilder.array([this.initBomForm()]),
        });
    }
    initBomForm() {
        return this._formBuilder.group({
            sizeWidth: [null, [Validators.required]],
            consumption: [null, [Validators.required]],
            description: null,
            materialId: [null, [Validators.required]],
        });
    }

    addNewBomRow() {
        const control = <FormArray>this.bomsListForm.controls['boMs'];
        control.push(this.initBomForm());
    }

    deleteBomRow(i: number) {
        const control = <FormArray>this.bomsListForm.controls['boMs'];
        if (control !== null) {
            this.totalBomRow = control.value.length;
        }
        if (this.totalBomRow > 1) {
            control.removeAt(i);
        } else {
            return false;
        }
    }

    initSpecificationListForm() {
        this.specificationsListForm = this._formBuilder.group({
            specifications: this._formBuilder.array([]),
        });
    }

    initSpecificationForm() {
        this.specificationForm = this._formBuilder.group({
            sizeName: [null, [Validators.required]],
            colorCode: [null, [Validators.required]],
            measurements: [null, [Validators.required]],
            boMs: [null, [Validators.required]],
            qualityStandards: [null, [Validators.required]],
        });
    }

    initSizeForm() {
        this.sizeForm = this._formBuilder.group({
            sizeName: [null, [Validators.required]],
        });
    }

    initColorForm() {
        this.colorForm = this._formBuilder.group({
            colorCode: [null, [Validators.required]],
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
                // next: (result) => {
                //     this.matDialogRef.close('success');
                // },
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
                this.selectedMaterialsList = materialListReturn;
                console.log(this.selectedMaterialsList);

                return this.selectedMaterialsList;
            }
        });
    }

    openQualityStandardsDialog() {
        if (
            this.selectedMaterialsList &&
            this.selectedMaterialsList.length > 0
        ) {
            console.log(this.selectedMaterialsList);

            this._dialog
                .open(QualityStandardsComponent, {
                    width: '1080px',
                    data: this.selectedMaterialsList,
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
