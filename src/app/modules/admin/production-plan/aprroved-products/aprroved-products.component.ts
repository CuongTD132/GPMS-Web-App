import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '../../product/product.service';
import { CreateYearProductionPlanComponent } from '../create/year/create-production-plan.component';

@Component({
    selector: 'aprroved-products',
    standalone: true,
    templateUrl: './aprroved-products.component.html',
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
    ],
})
export class ApprovedProductComponent implements OnInit {
    selectedPro: string = null;
    id: string = null;
    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    constructor(
        public matDialogRef: MatDialogRef<ApprovedProductComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Product[],
        private _productService: ProductService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {}

    getSelectedId(id: string) {
        this.id = id;
    }

    openCreateYearProductionPlanDialog() {
        if (this.id) {
            this._productService.getProductById(this.id).subscribe({
                next: (result) => {
                    this._dialog
                        .open(CreateYearProductionPlanComponent, {
                            data: result.specifications,
                            width: '720px',
                        })
                        .afterClosed()
                        .subscribe((result) => {
                            if (result === 'success') {
                                this.matDialogRef.close('success');
                            }
                        });
                },
                error: (err) => {
                    this.matDialogRef.close('error');
                },
            });
        }
    }
}
