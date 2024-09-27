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
            [Validators.required, Validators.min(1)]
        ),
        specifications: inject(FormBuilder).array(
            [
                inject(FormBuilder).group({
                    sizeName: [
                        '',
                        [Validators.required, Validators.minLength(1)],
                    ],
                    colorCode: ['', [Validators.required]],
                    measurements: inject(FormBuilder).array(
                        [
                            inject(FormBuilder).group({
                                name: [
                                    '',
                                    [
                                        Validators.required,
                                        Validators.minLength(6),
                                    ],
                                ],
                                measure: [
                                    1,
                                    [Validators.required, Validators.min(1)],
                                ],
                                unit: [
                                    '',
                                    [
                                        Validators.required,
                                        Validators.minLength(1),
                                    ],
                                ],
                            }),
                        ],
                        [Validators.required, Validators.minLength(1)]
                    ),
                    boMs: inject(FormBuilder).array(
                        [
                            inject(FormBuilder).group({
                                sizeWidth: [0, [Validators.required]],
                                consumption: [0, [Validators.required]],
                                description: ['', []],
                                materialId: ['', [Validators.required]],
                            }),
                        ],
                        [Validators.required, Validators.minLength(1)]
                    ),
                    qualityStandards: inject(FormBuilder).array(
                        [
                            inject(FormBuilder).group({
                                name: [
                                    '',
                                    [
                                        Validators.required,
                                        Validators.minLength(6),
                                    ],
                                ],
                                description: ['', []],
                                materialId: ['', []],
                            }),
                        ],
                        []
                    ),
                }),
            ],
            [Validators.required, Validators.min(1)]
        ),
        processes: inject(FormBuilder).array(
            [
                inject(FormBuilder).group({
                    code: ['', [Validators.required, Validators.minLength(6)]],
                    name: ['', [Validators.required, Validators.minLength(6)]],
                    orderNumber: [0, [Validators.required]],
                    description: ['', []],
                    type: ['', [Validators.required]],
                    steps: inject(FormBuilder).array(
                        [
                            inject(FormBuilder).group({
                                code: [
                                    '',
                                    [
                                        Validators.required,
                                        Validators.minLength(6),
                                    ],
                                ],
                                name: [
                                    '',
                                    [
                                        Validators.required,
                                        Validators.minLength(6),
                                    ],
                                ],
                                orderNumber: [0, [Validators.required]],
                                standardTime: [0, [Validators.required]],
                                outputPerHour: [0, [Validators.required]],
                                description: ['', []],
                                stepIOs: inject(FormBuilder).array(
                                    [
                                        inject(FormBuilder).group({
                                            quantity: [0, []],
                                            consumption: [0, []],
                                            isProduct: [
                                                false,
                                                [Validators.required],
                                            ],
                                            type: [
                                                'Input',
                                                [Validators.required],
                                            ],
                                            materialId: ['', []],
                                            semiFinishedProductCode: ['', []],
                                        }),
                                    ],
                                    [
                                        Validators.required,
                                        Validators.minLength(1),
                                    ]
                                ),
                            }),
                        ],
                        [Validators.required, Validators.minLength(1)]
                    ),
                }),
            ],
            [Validators.required, Validators.min(1)]
        ),
    });
}
