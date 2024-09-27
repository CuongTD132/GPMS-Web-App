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
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { ProductFormService } from '../product-form.service';

@Component({
    standalone: true,
    selector: 'specification-form',
    templateUrl: './specification-form.component.html',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatExpansionModule,
        MatButtonModule,
    ],
})
export class SpecificationFormComponent {
    readonly form = inject(ProductFormService).form;
    specifications = this.form.controls.specifications;
    sizes: string[];
    materials: Material[];

    constructor(private _activatedRoute: ActivatedRoute,private cdref: ChangeDetectorRef) {
        this._activatedRoute.data.subscribe((data) => {
            this.sizes = data['sizes'];
            this.materials = data['materials'].data;
        });
        console.log(this.specifications.controls);
    }

    ngAfterContentChecked() {
        this.specifications = this.form.controls.specifications;
        this.cdref.detectChanges();
     }

    addSpecification() {
        const newSpec = {
            sizeName: new FormControl('', [
                Validators.required,
                Validators.minLength(1),
            ]),
            colorCode: new FormControl('', [Validators.required]),
            measurements: new FormArray(
                [
                    new FormGroup({
                        name: new FormControl('', [
                            Validators.required,
                            Validators.minLength(6),
                        ]),
                        measure: new FormControl(1, [
                            Validators.required,
                            Validators.min(1),
                        ]),
                        unit: new FormControl('', [
                            Validators.required,
                            Validators.minLength(1),
                        ]),
                    }),
                ],
                [Validators.required, Validators.minLength(1)]
            ),
            boMs: new FormArray(
                [
                    new FormGroup({
                        sizeWidth: new FormControl(0, [Validators.required]),
                        consumption: new FormControl(0, [Validators.required]),
                        description: new FormControl('', []),
                        materialId: new FormControl('', [Validators.required]),
                    }),
                ],
                [Validators.required, Validators.minLength(1)]
            ),
            qualityStandards: new FormArray(
                [
                    new FormGroup({
                        name: new FormControl('', [
                            Validators.required,
                            Validators.minLength(6),
                        ]),
                        description: new FormControl('', []),
                        materialId: new FormControl('', []),
                    }),
                ],
                [Validators.required, Validators.minLength(1)]
            ),
        };
        this.specifications.push(new FormGroup(newSpec, []));
        console.log(this.form.value);
    }

    removeSpecification(index: number) {
        event.preventDefault();
        console.log('spec index', index);
    }

    addMeasurement(specificationIndex: number) {
        const measurements =
            this.specifications.at(specificationIndex).controls.measurements;

        const newMeasure = {
            name: new FormControl('', [
                Validators.required,
                Validators.minLength(6),
            ]),
            measure: new FormControl(1, [
                Validators.required,
                Validators.min(1),
            ]),
            unit: new FormControl('', [
                Validators.required,
                Validators.minLength(1),
            ]),
        };

        measurements.push(new FormGroup(newMeasure, []));
    }

    removeMeasurement(specificationIndex: number, index: number) {
        this.specifications
            .at(specificationIndex)
            .controls.measurements.removeAt(index);
    }

    addBoM(specificationIndex: number) {
        const boMs = this.specifications.at(specificationIndex).controls.boMs;

        const newBoM = {
            sizeWidth: new FormControl(0, [Validators.required]),
            consumption: new FormControl(0, [Validators.required]),
            description: new FormControl('', []),
            materialId: new FormControl('', [Validators.required]),
        };

        boMs.push(new FormGroup(newBoM, []));
    }

    removeBoM(specificationIndex: number, index: number) {
        this.specifications
            .at(specificationIndex)
            .controls.boMs.removeAt(index);
    }

    addQualityStandard(specificationIndex: number) {
        const qualityStandards =
            this.specifications.at(specificationIndex).controls
                .qualityStandards;

        const newQualityStandard = {
            name: new FormControl('', [
                Validators.required,
                Validators.minLength(6),
            ]),
            description: new FormControl('', []),
            materialId: new FormControl('', []),
        };

        qualityStandards.push(new FormGroup(newQualityStandard, []));
    }

    removeQualityStandard(specificationIndex: number, index: number) {
        this.specifications
            .at(specificationIndex)
            .controls.qualityStandards.removeAt(index);
    }
}