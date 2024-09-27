import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { CarouselModule } from '@fuse/components/carousel/carousel.module';
import { CustomPipeModule } from '@fuse/pipes/pipe.module';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { ProcessService } from '../../process/process.service';
import { SemiService } from '../../semi/semi.service';
import { SpecificationService } from '../../specification/specification.service';
import { StepService } from '../../step/step.service';
import { ProductService } from '../product.service';
import { DeclineComponent } from './decline/decline.component';
import { StepDetailComponent } from './step-detail/step-detail.component';

@Component({
    selector: 'product-detail',
    standalone: true,
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css'],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        MatChipsModule,
        CustomPipeModule,
        MatTabsModule,
        RouterModule,
        MatExpansionModule,
        MatTooltipModule,
        MatMenuModule,
        FuseAlertComponent,
        CarouselModule,
    ],
})
export class ProductDetailComponent implements OnInit {
    @ViewChild('uploadImg') private _avatarFileInput: ElementRef;
    stepsList: Step[] = [];
    stepDetail: StepDetail;
    specification: Specification;
    product: Product;
    semies: SemiFinishedProduct[];
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    role: string = null;
    constructor(
        private _router: Router,
        private _productService: ProductService,
        private _specificationsService: SpecificationService,
        private _processService: ProcessService,
        private _semiService: SemiService,
        private _dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _stepService: StepService,
        private _userService: UserService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngOnInit(): void {
        this._userService.get().subscribe((user) => {
            this.role = user.role;
        });
        this._productService.product$.subscribe((product) => {
            this.product = product;
            this._semiService.getSemies(this.product.id).subscribe((semies) => {
                this.semies = semies.data;
            });
        });
    }
    showConfirmDialog(id: string) {
        this._fuseConfirmationService
            .open({
                title: 'Are you sure?',
                message: 'This action will delete this product',
                icon: {
                    color: 'error',
                    name: 'heroicons_outline:trash',
                },
            })
            .afterClosed()
            .subscribe((result) => {
                if (result === 'confirmed') {
                    this.deleteProduct(id);
                }
                if (result === 'cancelled') {
                }
            });
    }
    approveProduct(id: string) {
        this._productService.approveProduct(id).subscribe({
            next: () => {
                this._productService.getProducts().subscribe((res) => {
                    this.showFlashMessage(
                        'success',
                        'Product has been aprrove successful',
                        3000
                    );
                    setTimeout(() => {
                        this._router.navigate(['/products']);
                    }, 1000);
                });
            },
            error: () =>
                this.showFlashMessage(
                    'error',
                    'Product has been aprrove failed',
                    3000
                ),
        });
    }

    decline(id: string): void {
        this._dialog
            .open(DeclineComponent, {
                width: '720px',
                data: id,
            })
            .afterClosed()
            .subscribe((result) => {
                console.log(result);

                if (result === 'success') {
                    this._productService.getProducts().subscribe((res) => {
                        this.showFlashMessage(
                            'success',
                            'Product has been decline successful',
                            3000
                        );
                        setTimeout(() => {
                            this._router.navigate(['/products']);
                        }, 1000);
                    });
                }
                if (result === 'error') {
                    this.showFlashMessage(
                        'error',
                        'Product has been decline failed',
                        3000
                    );
                }
            });
    }

    deleteProduct(id: string) {
        this._productService.deleteProduct(id).subscribe({
            next: () => {
                this._productService.getProducts().subscribe((res) => {
                    this.showFlashMessage(
                        'success',
                        'Product has been delete successful',
                        3000
                    );
                    setTimeout(() => {
                        this._router.navigate(['/products']);
                    }, 1000);
                });
            },
            error: () =>
                this.showFlashMessage(
                    'error',
                    'Product has been delete failed',
                    3000
                ),
        });
    }

    uploadSpecImg(proId: string, id: string, fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        // const file = fileList[0];
        // // Return if the file is not allowed
        // if (!allowedTypes.includes(file.type)) {
        //     return;
        // }
        // const formData = new FormData();
        // if (file) {
        //     formData.append('imageURLs', file);
        //     this._productService.uploadSpecImg(id, formData).subscribe({
        //         next: () => {
        //             this._productService.getProductById(proId).subscribe();
        //             this._productService.getProducts().subscribe();
        //             this.showFlashMessage(
        //                 'success',
        //                 'Image has been upload successful',
        //                 3000
        //             );
        //         },
        //         error: () =>
        //             this.showFlashMessage(
        //                 'error',
        //                 'Image has been upload failed',
        //                 3000
        //             ),
        //     });
        // }
        const formData = new FormData();
        for (let i = 0; i < fileList.length; i++) {
            if (allowedTypes.includes(fileList.item(i).type)) {
            formData.append('imageURLs', fileList.item(i));
            }
        }

// Upload the avatar
        this._productService.uploadSpecImg(id, formData).subscribe({
            next: () => {
                this._productService.getProductById(proId).subscribe();
                this._productService.getProducts().subscribe();
                this.showFlashMessage(
                    'success',
                    'Image has been upload successful',
                    3000
                );
            },
            error: () =>
                this.showFlashMessage(
                    'error',
                    'Image has been upload failed',
                    3000
                ),
        });

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

    onFileSelected(event: Event): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewUrl = e.target?.result;
            };
            reader.readAsDataURL(file);
        }
    }

    openProcessPanel(id: string) {
        this._processService.getProcessById(id).subscribe((process) => {
            if (process) {
                this.stepsList = process.steps;
            }
        });
    }

    openSpecPanel(id: string) {
        this._specificationsService
            .getSpecificationById(id)
            .subscribe((spec) => {
                if (spec) {
                    this.specification = spec;
                    console.log(this.specification);
                }
            });
    }

    openStepDetailDialog(id: string) {
        this._stepService.getStepById(id).subscribe((step) => {
            if (step) {
                this._dialog
                    .open(StepDetailComponent, {
                        width: '860px',
                        data: step,
                    })
                    .afterClosed()
                    .subscribe();
            }
        });
    }
}
