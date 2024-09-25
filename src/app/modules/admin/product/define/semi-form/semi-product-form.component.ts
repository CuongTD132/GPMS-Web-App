import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { ProductFormService } from '../product-form.service';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'semi-product-form',
    templateUrl: './semi-product-form.component.html',
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
export class SemiProductFormComponent {
    readonly form = inject(ProductFormService).form;
    temp = this.form.get('semiFinishedProducts') as unknown;
    semiFinishedProducts = this.form.controls.semiFinishedProducts;

    constructor(private _activatedRoute: ActivatedRoute) {
        console.log(this.semiFinishedProducts.controls)}

    addSemiFinishedProduct() {
        const newSemi = {
            code: new FormControl('', [Validators.required, Validators.minLength(6)]),
            name: new FormControl('', [Validators.required, Validators.minLength(6)]),
            quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
            description: new FormControl('', []),
        };
        this.semiFinishedProducts.push(new FormGroup(newSemi, []));
        console.log(this.semiFinishedProducts)
        console.log(this.form.value);
    }
}
