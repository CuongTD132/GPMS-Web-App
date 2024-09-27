import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { ProductFormService } from '../product-form.service';

@Component({
    standalone: true,
    selector: 'general-product-form',
    templateUrl: './general-product-form.component.html',
    imports: [
        ReactiveFormsModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
})
export class GeneralProductFormComponent {
    readonly form = inject(ProductFormService).form;
    categories: Category[];

    constructor(private _activatedRoute: ActivatedRoute) {
        this._activatedRoute.data.subscribe((data) => {
            this.categories = data['categories'].data;
            if (this.categories) {
                this.form.get('categoryId').setValue(this.categories[0].id);
            }
        });
    }
}
