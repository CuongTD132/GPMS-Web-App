import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProcessService } from '../../process/process.service';
import { CreateYearProductionPlanComponent } from '../../production-plan/create/year/create-production-plan.component';
import { SemiService } from '../../semi/semi.service';
import { SpecificationService } from '../../specification/specification.service';
import { ProductService } from '../product.service';
import { ProcessDetailComponent } from './process-detail/process-detail.component';
import { SpecificationDetailComponent } from './specification-detail/specification-detail.component';
import { CustomPipeModule } from '@fuse/pipes/pipe.module';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';


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
        RouterModule
    ],
})
export class ProductDetailComponent implements OnInit {
    product: Product;
    semies: SemiFinishedProduct[];
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    updateProductForm: UntypedFormGroup;
    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    constructor(
        private _productService: ProductService,
        private _specificationsService: SpecificationService,
        private _processService: ProcessService,
        private _semiService: SemiService,
        private _dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef
    ) { }

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

    openSpecificationDetailDialog(id: string) {
        this._specificationsService
            .getSpecificationById(id)
            .subscribe((specification) => {
                if (specification) {
                    this._dialog
                        .open(SpecificationDetailComponent, {
                            width: '1080px',
                            data: specification,
                        })
                        .afterClosed()
                        .subscribe();
                } else {
                    // Handle undefined case (optional: show error message, etc.)
                    return undefined;
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
}
