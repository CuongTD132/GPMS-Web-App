import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { CustomPipeModule } from '@fuse/pipes/pipe.module';
import { ProcessService } from '../../process/process.service';
import { CreateYearProductionPlanComponent } from '../../production-plan/create/year/create-production-plan.component';
import { SemiService } from '../../semi/semi.service';
import { SpecificationService } from '../../specification/specification.service';
import { StepService } from '../../step/step.service';
import { ProductService } from '../product.service';
import { ProcessDetailComponent } from './process-detail/process-detail.component';
import { StepDetailComponent } from './process-detail/step-detail/step-detail.component';

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
    ],
})
export class ProductDetailComponent implements OnInit {
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
    constructor(
        private _productService: ProductService,
        private _specificationsService: SpecificationService,
        private _processService: ProcessService,
        private _semiService: SemiService,
        private _dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _stepService: StepService
    ) {}

    ngOnInit(): void {
        this._productService.product$.subscribe((product) => {
            this.product = product;
            this._semiService.getSemies(this.product.id).subscribe((semies) => {
                this.semies = semies.data;
            });
        });
        // console.log(this.semies$);
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

    openCreateYearProductionPlanDialog() {
        this._dialog
            .open(CreateYearProductionPlanComponent, {
                data: this.product.specifications,
                width: '720px',
                height: '720px',
            })
            .afterClosed()
            .subscribe((result) => {
                if (result === 'success') {
                    this.showFlashMessage(
                        'success',
                        'Create year production plan successful',
                        3000
                    );
                }
            });
    }

    openProcessDetailDialog(id: string) {
        this._processService.getProcessById(id).subscribe((process) => {
            if (process) {
                this._dialog
                    .open(ProcessDetailComponent, {
                        width: '900px',
                        data: process,
                    })
                    .afterClosed()
                    .subscribe();
            }
        });
    }

    openProcessPanel(id: string) {
        this._processService.getProcessById(id).subscribe((process) => {
            if (process) {
                this.stepsList = process.steps;
            }
        });
    }

    // openSpecificationDetailDialog(id: string) {
    //     this._specificationsService
    //         .getSpecificationById(id)
    //         .subscribe((specification) => {
    //             if (specification) {
    //                 this._dialog
    //                     .open(SpecificationDetailComponent, {
    //                         width: '1080px',
    //                         data: specification,
    //                     })
    //                     .afterClosed()
    //                     .subscribe();
    //             } else {
    //                 // Handle undefined case (optional: show error message, etc.)
    //                 return undefined;
    //             }
    //         });
    // }

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
