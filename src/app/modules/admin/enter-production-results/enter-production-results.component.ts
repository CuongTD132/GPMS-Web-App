import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    MatAutocompleteModule,
    MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { Observable, Subject, map, startWith } from 'rxjs';
import { ProcessService } from '../process/process.service';
import { ProductionPlanService } from '../production-plan/production-plan.service';
import { SeriesService } from '../series/series.service';
import { StepService } from '../step/step.service';
import { ProductionResultService } from './enter-production-results.service';
export interface State {
    name: string;
    population: string;
}

@Component({
    selector: 'enter-production-results',
    standalone: true,
    templateUrl: './enter-production-results.component.html',
    styleUrls: ['./enter-production-results.component.css'],
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
        MatAutocompleteModule,
        MatExpansionModule,
    ],
})
export class ProductionResultComponent implements OnInit {
    filterForm: FormGroup;
    isLoading: boolean = false;
    stepResultForm: FormGroup;
    totalIO: number = 0;
    inputOutputResults: InputOutputResult[] = [];
    quantityForms: { [key: string]: FormGroup } = {}; // Object to hold form groups for each item
    consumptionForms: { [key: string]: FormGroup } = {};
    productionPlans$: Observable<ProductionPlan[]>;
    productionPlans: ProductionPlan[] = [];
    productionPlan$: Observable<ProductionPlan>;
    productionReqs$: Observable<ProductionRequirement[]>;
    estimationsList: ProductionEstimation[];
    seriesList: ProductionSeries[];
    seriesId: string;
    stepId: string;
    processesList: Process[];
    stepsList: Step[];
    stepIOsList: IORespone[] = [];
    stepIOs: IORespone;
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
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    role: string = null;
    stateCtrl = new FormControl('');
    filteredStates: Observable<ProductionPlan[]>;
    states: State[] = [
        {
            name: 'Arkansas',
            population: '2.978M',
        },
        {
            name: 'California',
            population: '39.14M',
        },
        {
            name: 'Florida',
            population: '20.27M',
        },
        {
            name: 'Texas',
            population: '27.47M',
        },
    ];

    constructor(
        private _productionResultService: ProductionResultService,
        private _seriesService: SeriesService,
        private _productionPlanService: ProductionPlanService,
        private _processService: ProcessService,
        private _stepService: StepService,
        private _userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder
    ) {
        this.filteredStates = this.stateCtrl.valueChanges.pipe(
            startWith(''),
            map((state) =>
                state ? this._filterStates(state) : this.productionPlans.slice()
            )
        );
    }

    planSelectHandle(event: MatAutocompleteSelectedEvent): void {
        const planId = this.productionPlans.filter(
            (plan) => plan.code === event.option.value
        )[0].id;
        if (planId) {
            this._seriesService
                .getSeriesInProcess(planId)
                .subscribe((res) => (this.seriesList = res));
        }
    }

    private _filterStates(value: string): ProductionPlan[] {
        const filterValue = value.toLowerCase();

        return this.productionPlans.filter((state) =>
            state.name.toLowerCase().includes(filterValue)
        );
    }
    ngOnInit(): void {
        this.getProductionPlans();
        this._userService.get().subscribe((user) => {
            this.role = user.role;
        });
    }

    private getProductionPlans() {
        this.resetFromProPlan();
        this.productionPlans$ = this._productionResultService.productionPlans$;
        this.productionPlans$.subscribe((res) => (this.productionPlans = res));
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
            const filtered = this.stepIOsList.filter(
                (stepIO) => stepIO.stepId === this.stepId
            );
            const stepIOs = filtered.length > 0 ? filtered[0] : null;

            if (stepIOs) {
                if (stepIOs.inputs) {
                    if (stepIOs.inputs.materials) {
                        const stepIn = stepIOs.inputs.materials.length;
                        if (stepIn > 0) {
                            this.totalIO += stepIn;
                        }
                    }
                    if (stepIOs.inputs.products) {
                        const stepIn = stepIOs.inputs.products.length;
                        if (stepIn > 0) {
                            this.totalIO += stepIn;
                        }
                    }
                    if (stepIOs.inputs.semis) {
                        const stepIn = stepIOs.inputs.semis.length;
                        if (stepIn > 0) {
                            this.totalIO += stepIn;
                        }
                    }
                }
                if (stepIOs.outputs) {
                    if (stepIOs.outputs.materials) {
                        const stepOut = stepIOs.outputs.materials.length;
                        if (stepOut > 0) {
                            this.totalIO += stepOut;
                        }
                    }
                    if (stepIOs.outputs.products) {
                        const stepOut = stepIOs.outputs.products.length;
                        if (stepOut > 0) {
                            this.totalIO += stepOut;
                        }
                    }
                    if (stepIOs.outputs.semis) {
                        const stepOut = stepIOs.outputs.semis.length;
                        if (stepOut > 0) {
                            this.totalIO += stepOut;
                        }
                    }
                }
            }
            console.log(this.totalIO);
        }
    }

    initForms() {
        this.stepResultForm = this._formBuilder.group({
            stepId: [this.stepId, [Validators.required]],
            inputOutputResults: [[]],
        });

        const stepIOs = this.stepIOsList.filter(
            (stepIO) => stepIO.stepId === this.stepId
        )[0];

        // Create individual form groups for each item in inputs
        if (stepIOs?.inputs?.semis) {
            stepIOs.inputs.semis.forEach((item) => {
                this.quantityForms[item.id] = this._formBuilder.group({
                    quantity: [null, [Validators.required]],
                });
            });
        }
        if (stepIOs?.inputs?.products) {
            stepIOs.inputs.products.forEach((item) => {
                this.quantityForms[item.id] = this._formBuilder.group({
                    quantity: [null, [Validators.required]],
                });
            });
        }

        // Create individual form groups for each item in outputs
        if (stepIOs?.outputs?.semis) {
            stepIOs.outputs.semis.forEach((item) => {
                this.quantityForms[item.id] = this._formBuilder.group({
                    quantity: [null, [Validators.required]],
                });
            });
        }
        if (stepIOs?.outputs?.products) {
            stepIOs.outputs.products.forEach((item) => {
                this.quantityForms[item.id] = this._formBuilder.group({
                    quantity: [null, [Validators.required]],
                });
            });
        }

        if (stepIOs?.inputs?.materials) {
            stepIOs.inputs.materials.forEach((item) => {
                this.consumptionForms[item.id] = this._formBuilder.group({
                    consumption: [null, [Validators.required]],
                });
            });
        }
        if (stepIOs?.outputs?.materials) {
            stepIOs.outputs.materials.forEach((item) => {
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
        this.inputOutputResults = [];
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

    openStepCard(id: string) {
        if (!this.stepIOsList) {
            this.stepIOsList = [];
        }

        const length = this.stepIOsList.filter(
            (stepIOs) => stepIOs.stepId === id
        ).length;

        if (length === 0) {
            this.getStepIOsList(id);
        } else {
            this.stepIOs = this.stepIOsList.find(
                (stepIOs) => stepIOs.stepId === id
            );
            this.stepId = id;
            this.initForms();
        }

        console.log(this.stepIOsList);
    }

    getStepIOsList(id: string) {
        this.totalIO = 0;
        this.stepId = id;

        // if (this.stepIOs.stepId === id) {
        this._stepService
            .getStepIOListByStepId(id, this.seriesId)
            .subscribe((stepIOs) => {
                stepIOs.stepId = id;
                this.stepIOs = stepIOs;
                this.stepIOsList.push(stepIOs),
                    this.resetFromStep(),
                    this.initForms(),
                    this.getTotalStepIO();
            });
        // }
    }
}
