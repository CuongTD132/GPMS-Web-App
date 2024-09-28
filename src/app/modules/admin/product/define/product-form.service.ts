import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable()
export class ProductFormService {
    readonly form = inject(FormBuilder).group({
        code: ['', [Validators.required, Validators.minLength(6)]],
        name: ['', [Validators.required, Validators.minLength(3)]],
        categoryId: ['', [Validators.required]],
        description: ['', []],
        semiFinishedProducts: inject(FormBuilder).array(
            [
                inject(FormBuilder).group({
                    code: ['', [Validators.required, Validators.minLength(6)]],
                    name: ['', [Validators.required, Validators.minLength(3)]],
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
                    colorCode: ['#000000', [Validators.required]],
                    measurements: inject(FormBuilder).array(
                        [
                            inject(FormBuilder).group({
                                name: [
                                    '',
                                    [
                                        Validators.required,
                                        Validators.minLength(3),
                                    ],
                                ],
                                measure: [
                                    1,
                                    [Validators.required, Validators.min(0.1)],
                                ],
                                unit: ['', [Validators.required]],
                            }),
                        ],
                        [Validators.required, Validators.minLength(1)]
                    ),
                    boMs: inject(FormBuilder).array(
                        [
                            inject(FormBuilder).group({
                                sizeWidth: [
                                    1,
                                    [Validators.required, Validators.min(0.1)],
                                ],
                                consumption: [
                                    1,
                                    [Validators.required, Validators.min(0.1)],
                                ],
                                description: ['', []],
                                materialId: ['', [Validators.required, Validators.minLength(1)]],
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
                                        Validators.minLength(3),
                                    ],
                                ],
                                description: [
                                    '',
                                    [
                                        Validators.required,
                                        Validators.minLength(3),
                                    ],
                                ],
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
                    name: ['', [Validators.required, Validators.minLength(3)]],
                    orderNumber: [1, [Validators.required, Validators.min(1)]],
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
                                        Validators.minLength(3),
                                    ],
                                ],
                                orderNumber: [
                                    1,
                                    [Validators.required, Validators.min(1)],
                                ],
                                standardTime: [
                                    1,
                                    [Validators.required, Validators.min(0.1)],
                                ],
                                outputPerHour: [
                                    1,
                                    [Validators.required, Validators.min(0.1)],
                                ],
                                description: ['', []],
                                stepIOs: inject(FormBuilder).array(
                                    [
                                        inject(FormBuilder).group({
                                            quantity: [1, [Validators.min(1)]],
                                            consumption: [
                                                1,
                                                [
                                                    Validators.required,
                                                    Validators.min(0.1),
                                                ],
                                            ],
                                            isProduct: [
                                                false,
                                                [Validators.required],
                                            ],
                                            type: [
                                                'Input',
                                                [Validators.required],
                                            ],
                                            materialId: [
                                                '',
                                                [Validators.required, Validators.minLength(1)],
                                            ],
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
