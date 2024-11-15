import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { GeneralProductFormComponent } from './general-form/general-product-form.component';
import { ProcessFormComponent } from './process-form/process-form.component';
import { ProductFormService } from './product-form.service';
import { SemiProductFormComponent } from './semi-form/semi-product-form.component';
import { SpecificationFormComponent } from './specification-form/specification-form.component';

@Component({
    standalone: true,
    selector: 'define',
    templateUrl: './define-product.component.html',
    styleUrl: './define-product.component.css',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatStepperModule,
        GeneralProductFormComponent,
        SemiProductFormComponent,
        SpecificationFormComponent,
        ProcessFormComponent,
    ],
    providers: [ProductFormService],
})
export class DefineProductComponent implements OnInit {
    readonly form = inject(ProductFormService).form;

    ngOnInit(): void {}

    onSubmit(): void {
        //console.log('Submitting', this.form.value);
    }
}
