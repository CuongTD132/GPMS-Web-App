import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
    ],
})
export class ProductionResultComponent implements OnInit {
    stepResultForm: FormGroup;
    consumptionForm: FormGroup;
    totalIO: number = 0;
    inputOutputResults: InputOutputResult[] = [];
    quantityForm: FormGroup;
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
    constructor(
        private _productionResultService: ProductionResultService,
        private _productionPlanService: ProductionPlanService,
        private _processService: ProcessService,
        private _stepService: StepService,
        private _formBuilder: FormBuilder
    ) {}
    ngOnInit(): void {
        this.getProductionPlans();
    }

    private getProductionPlans() {
        this.resetFromProPlan();
        this.productionPlans$ = this._productionResultService.productionPlans$;
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

    initStepResultForm() {
        this.stepResultForm = this._formBuilder.group({
            stepId: [this.stepId, [Validators.required]],
            inputOutputResults: [[], [Validators.required]],
        });
        if (this.stepResultForm.valid) {
        }
    }

    initQuantityForm() {
        this.quantityForm = this._formBuilder.group({
            stepInputOutputId: null,
            quantity: [null, [Validators.required]],
        });
    }

    initConsumptionForm() {
        this.consumptionForm = this._formBuilder.group({
            stepInputOutputId: null,
            consumption: [null, [Validators.required]],
        });
    }

    saveQuantityForm(id: string) {
        this.quantityForm.controls['stepInputOutputId'].setValue(id);
        console.log(this.quantityForm.value);
        if (this.quantityForm.valid) {
            const existingIndex = this.inputOutputResults.findIndex(
                (result) => result.stepInputOutputId === id
            );
            if (existingIndex !== -1) {
                // Update the existing object
                this.inputOutputResults[existingIndex] =
                    this.quantityForm.value;
            } else {
                // Push the new object
                this.inputOutputResults.push(this.quantityForm.value);
            }
            console.log(this.inputOutputResults);
        }
    }

    saveConsumptionForm(id: string) {
        this.consumptionForm.controls['stepInputOutputId'].setValue(id);
        console.log(this.consumptionForm.value);
        if (this.consumptionForm.valid) {
            const existingIndex = this.inputOutputResults.findIndex(
                (result) => result.stepInputOutputId === id
            );
            if (existingIndex !== -1) {
                // Update the existing object
                this.inputOutputResults[existingIndex] =
                    this.consumptionForm.value;
            } else {
                // Push the new object
                this.inputOutputResults.push(this.consumptionForm.value);
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
                .subscribe(() => this.resetAll());
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
        this._stepService.getStepListByProcessId(id).subscribe((steps) => {
            (this.stepsList = steps.data), this.resetFromProcess();
        });
    }

    getStepIOsList(id: string) {
        this.stepId = id;
        this._stepService
            .getStepIOListByStepId(id, this.seriesId)
            .subscribe((stepIOs) => {
                (this.stepIOsList = stepIOs),
                    this.resetFromStep(),
                    this.initStepResultForm(),
                    this.initQuantityForm(),
                    this.initConsumptionForm(),
                    this.getTotalStepIO();
            });
    }
}
