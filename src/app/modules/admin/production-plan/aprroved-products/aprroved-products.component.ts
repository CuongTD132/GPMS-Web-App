import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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
        private _dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {}

    getSelectedId(id: string) {
        this.id = id;
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
        if (this.id) {
            this._productService.getProductById(this.id).subscribe({
                next: (result) => {
                    this.matDialogRef.close('success');
                    this._dialog
                        .open(CreateYearProductionPlanComponent, {
                            data: result.specifications,
                            width: '720px',
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
                },
                error: (err) => {
                    this.matDialogRef.close('error');
                },
            });
        }
    }
}
