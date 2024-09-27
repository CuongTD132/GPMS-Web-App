import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
    FormArray,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../product.service';
import { ProductFormService } from '../product-form.service';

@Component({
    standalone: true,
    selector: 'process-form',
    templateUrl: './process-form.component.html',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatExpansionModule,
        MatButtonModule,
        MatRadioModule,
    ],
})
export class ProcessFormComponent {
    readonly form = inject(ProductFormService).form;
    semiFinishedProducts = this.form.controls.semiFinishedProducts;
    specifications = this.form.controls.specifications;
    processes = this.form.controls.processes;
    materials: Material[] = [];
    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    // selectedMaterials: {
    //     processIndex: number,
    //     steps: {
    //         stepIndex: number,
    //         stepIOs: {
    //             stepIOIndex: number,

    //         }[]
    //     }[]
    //  }[] = [];
    selectedMaterials: {
        id: string;
        name: string;
        sizeName: string;
        colorCode: string;
        consumption: number;
    }[] = [];

    constructor(
        private _router: Router,
        private _productService: ProductService,
        private _activatedRoute: ActivatedRoute,
        private cdref: ChangeDetectorRef
    ) {
        this._activatedRoute.data.subscribe((data) => {
            this.materials = data['materials'].data;
        });
    }

    ngAfterContentChecked() {
        this.specifications = this.form.controls.specifications;
        this.getSelectedMaterials();
        this.cdref.detectChanges();
    }

    submit() {
        console.log('Submitting', this.form.value);
        this._productService.createProduct(this.form.value).subscribe(() => {
            this.showFlashMessage('success', 'Create product successful', 3000);
            setInterval(() => {
                this._router.navigate(['/products']);
            }, 3000);
        });
    }

    private showFlashMessage(
        type: 'success' | 'error',
        message: string,
        time: number
    ): void {
        this.flashMessage = type;
        this.message = message;
        this.cdref.markForCheck();
        setTimeout(() => {
            this.flashMessage = this.message = null;
            this.cdref.markForCheck();
        }, time);
    }

    onSelectItemType(
        processIndex: number,
        stepIndex: number,
        stepIOIndex: number,
        event: MatSelectChange
    ) {
        switch (event.value) {
            case 'Material':
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.materialId.setValidators([Validators.required]);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.consumption.setValidators([Validators.required]);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.semiFinishedProductCode.setValidators([]);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.quantity.setValidators([]);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.isProduct.setValue(false);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.semiFinishedProductCode.setValue(null);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.quantity.setValue(null);
                this.getSelectedMaterials();
                console.log(this.selectedMaterials);
                break;
            case 'Semi':
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.semiFinishedProductCode.setValidators([
                        Validators.required,
                    ]);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.quantity.setValidators([Validators.required]);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.materialId.setValidators([]);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.consumption.setValidators([]);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.isProduct.setValue(false);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.materialId.setValue(null);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.consumption.setValue(null);
                break;
            case 'Finished':
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.semiFinishedProductCode.setValidators([]);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.quantity.setValidators([]);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.materialId.setValidators([]);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.consumption.setValidators([]);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.isProduct.setValue(true);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.materialId.setValue(null);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.consumption.setValue(null);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.semiFinishedProductCode.setValue(null);
                this.processes
                    .at(processIndex)
                    .controls.steps.at(stepIndex)
                    .controls.stepIOs.at(stepIOIndex)
                    .controls.quantity.setValue(1);
                break;
        }
        console.log(
            this.processes
                .at(processIndex)
                .controls.steps.at(stepIndex)
                .controls.stepIOs.at(stepIOIndex)
        );
    }

    onSelectMaterial(
        processIndex: number,
        stepIndex: number,
        stepIOIndex: number,
        event: MatSelectChange
    ) {
        const consumptionOfBom = this.selectedMaterials.find(
            (selected) => selected.id === event.value
        ).consumption;

        this.processes
            .at(processIndex)
            .controls.steps.at(stepIndex)
            .controls.stepIOs.at(stepIOIndex)
            .controls.consumption.setValue(consumptionOfBom);
    }

    getSelectedMaterials() {
        const materialList = [];
        this.specifications.value.map((specification) =>
            specification.boMs.map((bom) =>
                materialList.push({
                    id: bom.materialId,
                    sizeName: specification.sizeName,
                    colorCode: specification.colorCode,
                    color:
                        this.materials.find(
                            (material) => material.id === bom.materialId
                        )?.colorCode ?? '',
                    name:
                        this.materials.find(
                            (material) => material.id === bom.materialId
                        )?.name ?? '',
                    consumption: bom.consumption,
                })
            )
        );

        const array1 = this.selectedMaterials.filter((selected) => {
            return !materialList.some(
                (material) => material.id === selected.id
            );
        });

        this.processes.value.map((process) =>
            process.steps.map((step) =>
                step.stepIOs.map((stepIO) => {
                    stepIO.materialId &&
                        array1.map(
                            (array) =>
                                stepIO.materialId === array.id &&
                                (stepIO.materialId = '')
                        );
                })
            )
        );

        this.selectedMaterials = materialList;
    }

    addProcess() {
        const newProcess = {
            code: new FormControl('', [
                Validators.required,
                Validators.minLength(6),
            ]),
            name: new FormControl('', [
                Validators.required,
                Validators.minLength(6),
            ]),
            orderNumber: new FormControl(0, [Validators.required]),
            description: new FormControl('', []),
            type: new FormControl('', [Validators.required]),
            steps: new FormArray(
                [
                    new FormGroup({
                        code: new FormControl('', [
                            Validators.required,
                            Validators.minLength(6),
                        ]),
                        name: new FormControl('', [
                            Validators.required,
                            Validators.minLength(6),
                        ]),
                        orderNumber: new FormControl(0, [Validators.required]),
                        standardTime: new FormControl(0, [Validators.required]),
                        outputPerHour: new FormControl(0, [
                            Validators.required,
                        ]),
                        description: new FormControl('', []),
                        stepIOs: new FormArray(
                            [
                                new FormGroup({
                                    quantity: new FormControl(0, []),
                                    consumption: new FormControl(0, [
                                        Validators.required,
                                    ]),
                                    isProduct: new FormControl(false, [
                                        Validators.required,
                                    ]),
                                    type: new FormControl('', [
                                        Validators.required,
                                    ]),
                                    materialId: new FormControl('', [
                                        Validators.required,
                                    ]),
                                    semiFinishedProductCode: new FormControl(
                                        '',
                                        []
                                    ),
                                }),
                            ],
                            [Validators.required, Validators.minLength(1)]
                        ),
                    }),
                ],
                [Validators.required, Validators.minLength(1)]
            ),
        };
        this.processes.push(new FormGroup(newProcess, []));
        console.log(this.form.value);
    }

    removeProcess(index: number) {
        console.log('spec index', index);
    }

    addStep(processIndex: number) {
        const steps = this.processes.at(processIndex).controls.steps;

        const newStep = {
            code: new FormControl('', [
                Validators.required,
                Validators.minLength(6),
            ]),
            name: new FormControl('', [
                Validators.required,
                Validators.minLength(6),
            ]),
            orderNumber: new FormControl(0, [Validators.required]),
            standardTime: new FormControl(0, [Validators.required]),
            outputPerHour: new FormControl(0, [Validators.required]),
            description: new FormControl('', []),
            stepIOs: new FormArray(
                [
                    new FormGroup({
                        quantity: new FormControl(0, []),
                        consumption: new FormControl(0, []),
                        isProduct: new FormControl(false, [
                            Validators.required,
                        ]),
                        type: new FormControl('', [Validators.required]),
                        materialId: new FormControl('', []),
                        semiFinishedProductCode: new FormControl('', []),
                    }),
                ],
                [Validators.required, Validators.minLength(1)]
            ),
        };

        steps.push(new FormGroup(newStep, []));
    }

    removeStep(processIndex: number, index: number) {
        this.processes.at(processIndex).controls.steps.removeAt(index);
    }

    addStepIO(processIndex: number, stepIndex: number) {
        const stepIOs = this.processes
            .at(processIndex)
            .controls.steps.at(stepIndex).controls.stepIOs;

        const newStepIO = {
            quantity: new FormControl(0, []),
            consumption: new FormControl(0, []),
            isProduct: new FormControl(false, [Validators.required]),
            type: new FormControl('', [Validators.required]),
            materialId: new FormControl('', []),
            semiFinishedProductCode: new FormControl('', []),
        };

        stepIOs.push(new FormGroup(newStepIO, []));
    }

    removeStepIO(processIndex: number, stepIndex: number, index: number) {
        this.processes
            .at(processIndex)
            .controls.steps.at(stepIndex)
            .controls.stepIOs.removeAt(index);
    }
}
