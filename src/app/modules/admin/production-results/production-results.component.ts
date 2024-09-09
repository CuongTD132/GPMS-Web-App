import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { Observable, map } from 'rxjs';
import { ProcessService } from '../process/process.service';
import { ProductionPlanService } from '../production-plan/production-plan.service';
import { StepService } from '../step/step.service';
import { ProductionResultService } from './production-results.service';

@Component({
    selector: 'production-results',
    standalone: true,
    templateUrl: './production-results.component.html',
    styleUrls: ['./production-results.component.css'],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatChipsModule,
        RouterModule,
        MatTooltipModule,
        MatTabsModule,
        FuseAlertComponent,
    ],
})
export class ProductionResultComponent implements OnInit {
    stepResultForm: FormGroup;
    totalIO: number = 0;
    inputOutputResults: InputOutputResult[] = [];
    quantityForms: { [key: string]: FormGroup } = {}; // Object to hold form groups for each item
    consumptionForms: { [key: string]: FormGroup } = {};
    productionPlans$: Observable<ProductionPlan[]>;
    productionPlan$: Observable<ProductionPlan>;
    productionReqs$: Observable<ProductionRequirement[]>;
    estimationsList: ProductionEstimation[];
    seriesList: ProductionSeries[];
    seriesId: string;
    stepId: string;
    processesList: Process[];
    stepsList: Step[];
    stepIOsList: IORespone;
    selectedColor: string = null;
    selectedProPlan: string = null;
    selectedProReqs: string = null;
    selectedEstimation: string = null;
    selectedSeries: string = null;
    selectedProcess: string = null;
    selectedStep: string = null;
    selectedStepIO: string = null;
    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    constructor(
        private _productionResultService: ProductionResultService,
        private _productionPlanService: ProductionPlanService,
        private _processService: ProcessService,
        private _stepService: StepService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder
    ) {}
    ngOnInit(): void {
        this.getProductionPlans();
    }

    private getProductionPlans() {
        this.resetFromProPlan();
        this.productionPlans$ = this._productionResultService.productionPlans$;
    }
    private showFlashMessage(
        type: 'success' | 'error',
        message: string,
        time: number
    ): void {
        this.flashMessage = type;
        this.message = message;
        this._changeDetectorRef.markForCheck();
        setTimeout(() => {
            this.flashMessage = this.message = null;
            this._changeDetectorRef.markForCheck();
        }, time);
    }
    getTotalStepIO(): void {
        if (this.stepIOsList) {
            if (this.stepIOsList.inputs) {
                if (this.stepIOsList.inputs.materials) {
                    const stepIn = this.stepIOsList.inputs.materials.length;
                    if (stepIn > 0) {
                        this.totalIO += stepIn;
                    }
                }
                if (this.stepIOsList.inputs.products) {
                    const stepIn = this.stepIOsList.inputs.products.length;
                    if (stepIn > 0) {
                        this.totalIO += stepIn;
                    }
                }
                if (this.stepIOsList.inputs.semis) {
                    const stepIn = this.stepIOsList.inputs.semis.length;
                    if (stepIn > 0) {
                        this.totalIO += stepIn;
                    }
                }
            }
            if (this.stepIOsList.outputs) {
                if (this.stepIOsList.outputs.materials) {
                    const stepOut = this.stepIOsList.outputs.materials.length;
                    if (stepOut > 0) {
                        this.totalIO += stepOut;
                    }
                }
                if (this.stepIOsList.outputs.products) {
                    const stepOut = this.stepIOsList.outputs.products.length;
                    if (stepOut > 0) {
                        this.totalIO += stepOut;
                    }
                }
                if (this.stepIOsList.outputs.semis) {
                    const stepOut = this.stepIOsList.outputs.semis.length;
                    if (stepOut > 0) {
                        this.totalIO += stepOut;
                    }
                }
            }
        }
        console.log(this.totalIO);
    }

    initForms() {
        this.stepResultForm = this._formBuilder.group({
            stepId: [this.stepId, [Validators.required]],
            inputOutputResults: [[]],
        });

        // Create individual form groups for each item in inputs
        if (this.stepIOsList?.inputs?.semis) {
            this.stepIOsList.inputs.semis.forEach((item) => {
                this.quantityForms[item.id] = this._formBuilder.group({
                    quantity: [null, [Validators.required]],
                });
            });
        }
        if (this.stepIOsList?.inputs?.products) {
            this.stepIOsList.inputs.products.forEach((item) => {
                this.quantityForms[item.id] = this._formBuilder.group({
                    quantity: [null, [Validators.required]],
                });
            });
        }

        // Create individual form groups for each item in outputs
        if (this.stepIOsList?.outputs?.semis) {
            this.stepIOsList.outputs.semis.forEach((item) => {
                this.quantityForms[item.id] = this._formBuilder.group({
                    quantity: [null, [Validators.required]],
                });
            });
        }
        if (this.stepIOsList?.outputs?.products) {
            this.stepIOsList.outputs.products.forEach((item) => {
                this.quantityForms[item.id] = this._formBuilder.group({
                    quantity: [null, [Validators.required]],
                });
            });
        }

        if (this.stepIOsList?.inputs?.materials) {
            this.stepIOsList.inputs.materials.forEach((item) => {
                this.consumptionForms[item.id] = this._formBuilder.group({
                    consumption: [null, [Validators.required]],
                });
            });
        }
        if (this.stepIOsList?.outputs?.materials) {
            this.stepIOsList.outputs.materials.forEach((item) => {
                this.consumptionForms[item.id] = this._formBuilder.group({
                    consumption: [null, [Validators.required]],
                });
            });
        }
    }

    saveQuantityForm(id: string) {
        const form = this.quantityForms[id];
        if (form.valid) {
            const quantityValue = form.value.quantity;
            const existingIndex = this.inputOutputResults.findIndex(
                (result) => result.stepInputOutputId === id
            );
            if (existingIndex !== -1) {
                // Update the existing object
                this.inputOutputResults[existingIndex].quantity = quantityValue;
            } else {
                // Push the new object
                this.inputOutputResults.push({
                    stepInputOutputId: id,
                    quantity: quantityValue,
                });
            }
            console.log(this.inputOutputResults);
        }
    }

    saveConsumptionForm(id: string) {
        const form = this.consumptionForms[id];
        if (form.valid) {
            const consumptionValue = form.value.consumption;
            const existingIndex = this.inputOutputResults.findIndex(
                (result) => result.stepInputOutputId === id
            );
            if (existingIndex !== -1) {
                // Update the existing object
                this.inputOutputResults[existingIndex].consumption =
                    consumptionValue;
            } else {
                // Push the new object
                this.inputOutputResults.push({
                    stepInputOutputId: id,
                    consumption: consumptionValue,
                });
            }
            console.log(this.inputOutputResults);
        }
    }

    resetAll(): void {
        this.getProductionPlans();
        this.selectedColor = null;
        this.selectedProPlan = null;

        this.productionPlan$ = null;
        this.selectedProReqs = null;

        this.estimationsList = null;
        this.selectedEstimation = null;

        this.seriesList = null;
        this.selectedSeries = null;

        this.processesList = null;
        this.selectedProcess = null;

        this.stepsList = null;
        this.selectedStep = null;

        this.stepIOsList = null;
        this.selectedStepIO = null;
    }

    submit() {
        this.stepResultForm.controls['inputOutputResults'].setValue(
            this.inputOutputResults
        );
        console.log(this.stepResultForm.value);
        if (this.stepResultForm.valid) {
            this._stepService
                .createStepResult(this.seriesId, this.stepResultForm.value)
                .subscribe({
                    next: () => {
                        this.resetAll(),
                            this.showFlashMessage(
                                'success',
                                'Create production result successful',
                                3000
                            );
                    },
                    error: () => {
                        this.showFlashMessage(
                            'error',
                            'Create production result failed',
                            3000
                        );
                    },
                });
        }
    }

    logProPlan(): void {
        console.log(this.selectedProPlan);
    }

    logProReqs(): void {
        console.log(this.selectedProReqs);
    }

    logEstimation(): void {
        console.log(this.selectedEstimation);
    }

    getProReqs(id: string) {
        this.resetFromProPlan();

        this.productionPlan$ =
            this._productionPlanService.getProductionPlanById(id);
    }

    resetFromProPlan(): void {
        this.selectedColor = null;
        this.selectedProReqs = null;

        this.estimationsList = null;
        this.selectedEstimation = null;

        this.seriesList = null;
        this.selectedSeries = null;

        this.processesList = null;
        this.selectedProcess = null;

        this.stepsList = null;
        this.selectedStep = null;

        this.stepIOsList = null;
        this.selectedStepIO = null;
    }

    resetFromProReqs(): void {
        this.selectedEstimation = null;

        this.seriesList = null;
        this.selectedSeries = null;

        this.processesList = null;
        this.selectedProcess = null;

        this.stepsList = null;
        this.selectedStep = null;

        this.stepIOsList = null;
        this.selectedStepIO = null;
    }

    resetFromEstimation(): void {
        this.selectedSeries = null;

        this.processesList = null;
        this.selectedProcess = null;

        this.stepsList = null;
        this.selectedStep = null;

        this.stepIOsList = null;
        this.selectedStepIO = null;
    }

    resetFromSeries(): void {
        this.selectedProcess = null;

        this.stepsList = null;
        this.selectedStep = null;

        this.stepIOsList = null;
        this.selectedStepIO = null;
    }

    resetFromProcess(): void {
        this.selectedStep = null;

        this.stepIOsList = null;
        this.selectedStepIO = null;
    }

    resetFromStep(): void {
        this.selectedStepIO = null;
    }

    findEstimations(selectedId: string): void {
        this.productionPlan$
            .pipe(
                map((productionPlan) => {
                    if (
                        productionPlan &&
                        productionPlan.productionRequirements
                    ) {
                        const selectedRequirement =
                            productionPlan.productionRequirements.find(
                                (req) => req.id === selectedId
                            );
                        this.selectedColor =
                            selectedRequirement.productSpecification.colorCode;
                        return selectedRequirement?.productionEstimations || [];
                    }
                    return [];
                })
            )
            .subscribe((estimations) => {
                this.estimationsList = estimations;
                console.log(this.estimationsList);
                console.log(this.selectedColor);
                this.resetFromProReqs();
            });
    }

    findSeries(selectedId: string): void {
        const selectedItem = this.estimationsList.find(
            (item) => item.id === selectedId
        );
        if (selectedItem) {
            this.seriesList = selectedItem.productionSeries;
        } else {
            this.seriesList = [];
        }
        this.resetFromEstimation();
        console.log(this.seriesList);
    }

    getProcessesList(id: string) {
        this.seriesId = id;
        this._processService
            .getProcessListBySeriesId(id)
            .subscribe((processes) => {
                (this.processesList = processes), this.resetFromSeries();
            });
    }

    getStepsList(id: string) {
        this._stepService
            .getStepListByProcessIdAndSeriesId(id, this.seriesId)
            .subscribe((steps) => {
                (this.stepsList = steps), this.resetFromProcess();
            });
    }

    getStepIOsList(id: string) {
        this.totalIO = 0;
        this.stepId = id;
        this._stepService
            .getStepIOListByStepId(id, this.seriesId)
            .subscribe((stepIOs) => {
                (this.stepIOsList = stepIOs),
                    this.resetFromStep(),
                    this.initForms(),
                    this.getTotalStepIO();
            });
    }
}
