import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from '../../material/material.service';
import { ProductService } from '../product.service';
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
        MatRadioModule,
        MatTooltipModule,
    ],
})
export class CreateProductComponent implements OnInit {
    @ViewChild('stepperSpec') stepperSpec: MatStepper;
    @ViewChild('stepperProcess') stepperProcess: MatStepper;
    @ViewChild('stepperStep') stepperStep: MatStepper;
    @ViewChild('stepperStepIO') stepperStepIO: MatStepper;
    createProductForm: FormGroup;
    semiFinishedProductForm: FormGroup;
    semiListForm: FormGroup;
    measurementForm: FormGroup;
    isEditGeneral: boolean = true;
    isEditSubSpec: boolean = true;
    isEditStep: boolean = true;
    isEditProcess: boolean = true;
    isEditStepIO: boolean = true;
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
    sizeForm: FormGroup;
    colorForm: FormGroup;
    specificationsListForm: FormGroup;
    processForm: FormGroup;
    processesListForm: FormGroup;
    stepForm: FormGroup;
    stepListForm: FormGroup;
    stepIOListForm: FormGroup;
    matForm: FormGroup;
    proForm: FormGroup;
    semiForm: FormGroup;
    category: string = 'Material';
    categorys: string[] = ['Material', 'Product', 'Semi'];
    categories: Category[];
    selectedMaterialsList: Material[] = [];
    semiFinishedProducts: SemiFinishedProduct[] = [];
    process: any;
    processes: Process[] = [];
    specifications: NewSpecification[] = [];
    stepIOs: any[] = [];
    measurements: Measurement[] = [];
    boMs: NewBillOfMaterial[] = [];
    steps: Step[] = [];
    materials: Material[];
    sizes: string[];
    selectedMaterials: Material[] = [];
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private _productService: ProductService,
        private _dialog: MatDialog,
        private _materialService: MaterialService,
        private _router: Router
    ) {}

    logStepIOListForm(): void {
        console.log(this.stepIOListForm.value);
    }

    logProForm(): void {
        if (this.proForm.valid) {
            console.log(this.proForm.value);
            const control = <FormArray>this.stepIOListForm.controls['stepIOs'];
            control.push(this.proForm);
            console.log(this.stepIOListForm.value);

            this.stepIOs.push(this.proForm.value);
            this.stepForm.controls['stepIOs'].setValue(this.stepIOs);
            console.log(this.stepForm.value);
            this.isEditStepIO = !this.isEditStepIO;
        }
    }

    setCate() {
        this.isEditGeneral = false;
    }
    stepIOReset(): void {
        const currentData = this.stepIOListForm.value;
        this.stepperStepIO.reset();
        this.restoreFormData(currentData);
        this.initProForm();
        this.initSemiForm();
        this.initMatForm();

        this.isEditStepIO = !this.isEditStepIO;
        this.isEditStep = !this.isEditStep;
    }

    restoreFormData(data: any) {
        const stepIOs = this.stepIOListForm.get('stepIOs') as FormArray;
        stepIOs.clear();
        data.stepIOs.forEach((item: any) => {
            stepIOs.push(this._formBuilder.group(item));
        });
    }

    stepReset(): void {
        this.stepIOs = [];
        this.isEditProcess = false;
        this.stepperStep.reset();
        this.stepperStepIO.reset();
    }

    setStep(): void {
        this.steps.push(this.stepForm.value);
        console.log(this.steps);

        this.stepListForm.controls['steps'].setValue(this.steps);
        console.log(this.stepListForm.value);

        this.isEditStep = false;
    }
    processReset(): void {
        this.steps = [];
        this.stepIOs = [];
        this.stepperProcess.reset();
        this.stepperStep.reset();
        this.category = 'Material';
        this.isEditStep = !this.isEditStep;
    }

    logMatForm(): void {
        if (this.matForm.valid) {
            console.log(this.matForm.value);
            const control = <FormArray>this.stepIOListForm.controls['stepIOs'];
            control.push(this.matForm);
            console.log(this.stepIOListForm.value);

            this.stepIOs.push(this.matForm.value);
            this.stepForm.controls['stepIOs'].setValue(this.stepIOs);
            console.log(this.stepForm.value);
            this.isEditStepIO = !this.isEditStepIO;
        }
    }

    logSemiForm(): void {
        if (this.semiForm.valid) {
            console.log(this.semiForm.value);
            const control = <FormArray>this.stepIOListForm.controls['stepIOs'];
            control.push(this.semiForm);
            console.log(this.stepIOListForm.value);

            this.stepIOs.push(this.semiForm.value);
            this.stepForm.controls['stepIOs'].setValue(this.stepIOs);
            console.log(this.stepForm.value);
            this.isEditStepIO = !this.isEditStepIO;
        }
    }

    logStepForm(): void {
        console.log(this.stepForm.value);
    }

    logStepListForm(): void {
        console.log(this.stepListForm.value);
    }

    logProcessForm(): void {
        this.isEditProcess = false;
        this.processForm.controls.steps.setValue(
            this.stepListForm.controls.steps.value
        );
        console.log(this.processForm.value);

        this.processes.push(this.processForm.value);
        this.processesListForm.controls.processes.setValue(this.processes);
        console.log(this.processesListForm.value);
    }

    logProcessesListForm(): void {
        this.createProductForm.controls.processes.setValue(
            this.processesListForm.controls.processes.value
        );
        this.createProductForm.controls.semiFinishedProducts.setValue(
            this.semiListForm.controls.semiFinishedProducts.value
        );
        console.log(this.createProductForm.value);
        this.isEditGeneral = false;
    }

    logGeneralForm(): void {
        console.log(this.createProductForm.value);
    }

    logSemiListForm(): void {
        console.log(this.semiListForm.controls.semiFinishedProducts.value);
    }

    logMesureForm(): void {
        console.log(this.measurementsListForm.value);
    }

    logBomForm(): void {
        this.isEditSubSpec = !this.isEditSubSpec;
        this.boMs = this.bomsListForm.controls.boMs.value;
        console.log(this.boMs);
        this.getSelectedMaterial();
    }

    logSpecForm(): void {
        console.log(this.specificationForm.value);
    }

    logSpecListForm(): void {
        if (this.quaStandsListForm.valid) {
            this.stepperSpec.reset();
            this.resetAllRowsList();
            this.isEditSubSpec = !this.isEditSubSpec;
        }
    }

    specReset(): void {
        if (this.specificationForm.valid) {
            this.stepperSpec.reset();
            this.resetAllRowsList();

            this.isEditSubSpec = !this.isEditSubSpec;
        }
    }

    logQuaStandForm(): void {
        if (this.quaStandsListForm.valid) {
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
            const control = <FormArray>(
                this.specificationsListForm.controls['specifications']
            );
            const specification: NewSpecification =
                this.specificationForm.value;
            this.specifications.push(specification);
            this.createProductForm.controls['specifications'].setValue(
                this.specifications
            );
            console.log(this.createProductForm.value);
            control.push(this.specificationForm);
        }
    }

    ngOnInit(): void {
        this._activatedRoute.data.subscribe((data) => {
            this.categories = data['categories'].data;
            this.materials = data['materials'].data;
            this.sizes = data['sizes'];
        });
        this.initProductForm();
        this.initSemiFinishedProductForm();
        this.initSemiListForm();
        this.initMeasurementListForm();
        this.initBomListForm();
        this.initQuaStandListForm();
        this.initQuaStandForm();
        this.initSpecificationListForm();
        this.initSpecificationForm();
        this.initProcessesListFormForm();
        this.initProcessForm();
        this.initStepsListForm();
        this.initStepForm();
        this.initStepIOsListForm();
        this.initMatForm();
        this.initProForm();
        this.initSemiForm();
        this.initSizeForm();
        this.initColorForm();
    }

    initProductForm() {
        this.createProductForm = this._formBuilder.group({
            name: ['Áo thun', [Validators.required]],
            code: ['AOTHUN01', [Validators.required]],
            description: 'Áo thun thần kỳ với những màu sắc sặc sỡ',
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

    resetAllRowsList() {
        const controlMeasurements = this.measurementsListForm.get(
            'measurements'
        ) as FormArray;
        while (controlMeasurements.length > 1) {
            controlMeasurements.removeAt(0);
        }
        const controlBOMs = this.bomsListForm.get('boMs') as FormArray;
        while (controlBOMs.length > 1) {
            controlBOMs.removeAt(0);
        }
        const controlQuaStands = this.quaStandsListForm.get(
            'qualityStandards'
        ) as FormArray;
        while (controlQuaStands.length > 1) {
            controlQuaStands.removeAt(0);
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

    initSizeForm() {
        this.sizeForm = this._formBuilder.group({
            sizeName: [null, [Validators.required]],
        });
    }

    initColorForm() {
        this.colorForm = this._formBuilder.group({
            colorCode: ['#00897B', [Validators.required]],
        });
    }

    initSpecificationListForm() {
        this.specificationsListForm = this._formBuilder.group({
            specifications: this._formBuilder.array([], [Validators.required]),
        });
    }

    initSpecificationForm() {
        this.specificationForm = this._formBuilder.group({
            sizeName: null,
            colorCode: null,
            measurements: [null],
            boMs: [null],
            qualityStandards: [null],
        });
    }

    initProcessesListFormForm() {
        this.processesListForm = this._formBuilder.group({
            processes: [[], [Validators.required]],
        });
    }

    initProcessForm() {
        this.processForm = this._formBuilder.group({
            code: ['PROCESS001', [Validators.required]],
            name: ['Cắt', [Validators.required]],
            orderNumber: [1, [Validators.required]],
            description: null,
            steps: [],
        });
    }

    initStepsListForm() {
        this.stepListForm = this._formBuilder.group({
            steps: [[], [Validators.required]],
        });
    }

    initStepForm() {
        this.stepForm = this._formBuilder.group({
            code: ['Step-code', [Validators.required]],
            name: ['Step name', [Validators.required]],
            orderNumber: [1, [Validators.required]],
            standardTime: [10, [Validators.required]],
            outputPerHour: [10, [Validators.required]],
            description: null,
            stepIOs: [],
        });
    }

    initStepIOsListForm() {
        this.stepIOListForm = this._formBuilder.group({
            stepIOs: this._formBuilder.array([], [Validators.required]),
        });
    }

    initMatForm() {
        this.matForm = this._formBuilder.group({
            consumption: [null, [Validators.required]],
            materialId: [null, [Validators.required]],
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
            semiFinishedProductCode: [null, [Validators.required]],
            quantity: [null, [Validators.required]],
            isProduct: false,
            type: ['Input', [Validators.required]],
        });
    }

    createProduct() {
        this._productService
            .createProduct(this.createProductForm.value)
            .subscribe(() => {
                this._router.navigate(['/products']);
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
