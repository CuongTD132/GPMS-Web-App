import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable()
export class ProductFormService {
    readonly form = inject(FormBuilder).group({
        code: ['', [Validators.required, Validators.minLength(6)]],
        name: ['', [Validators.required, Validators.minLength(6)]],
        categoryId: ['', [Validators.required]],
        description: ['', []],
        semiFinishedProducts: inject(FormBuilder).array(
            [
                inject(FormBuilder).group({
                    code: ['', [Validators.required, Validators.minLength(6)]],
                    name: ['', [Validators.required, Validators.minLength(6)]],
                    quantity: [1, [Validators.required, Validators.min(1)]],
                    description: ['', []],
                }),
            ],
            [Validators.minLength(1)]
        ),
    });
}
