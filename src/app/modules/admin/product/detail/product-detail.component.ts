import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CreateYearProductionPlanComponent } from '../../production-plan/create/year/create-production-plan.component';
import { ProductService } from '../product.service';
import { ProcessDetailComponent } from './process-detail/process-detail.component';
import { SpecificationDetailComponent } from './specification-detail/specification-detail.component';

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
    ],
})
export class ProductDetailComponent implements OnInit {
    product: Product;
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    updateProductForm: UntypedFormGroup;
    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _productService: ProductService,
        private _dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this._productService.product$.subscribe((product) => {
            this.product = product;
            this.initProductForm();
        });
    }

    initProductForm() {
        this.updateProductForm = this._formBuilder.group({
            name: [this.product.name, [Validators.required]],
            code: [this.product.code, [Validators.required]],
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

    updateProduct() {}

    openSpecificationDetailDialog(specification: Specification) {
        this._dialog
            .open(SpecificationDetailComponent, {
                width: '1080px',
                data: specification,
            })
            .afterClosed()
            .subscribe();
    }

    openProcessDetailDialog(process: Process) {
        this._dialog
            .open(ProcessDetailComponent, {
                width: '900px',
                data: process,
            })
            .afterClosed()
            .subscribe();
    }
}
