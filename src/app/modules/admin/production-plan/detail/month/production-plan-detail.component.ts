import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { ProductionPlanService } from '../../production-plan.service';
import { BatchsListComponent } from './batchs-list/batchs-list.component';
import { EstimationsListComponent } from './estimations-list/estimations-list.component';

@Component({
    selector: 'month-production-plan-detail',
    standalone: true,
    templateUrl: './production-plan-detail.component.html',
    styleUrls: ['./production-plan-detail.component.css'],
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
        MatMenuModule,
        RouterModule,
        MatTooltipModule,
        FuseAlertComponent,
    ],
})
export class ProductionPlanMonthDetailComponent implements OnInit {
    productionPlan: ProductionPlan;
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    updateProductionPlanForm: UntypedFormGroup;
    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    constructor(
        private _productionPlanService: ProductionPlanService,
        private _dialog: MatDialog,
        private dateAdapter: DateAdapter<Date>,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this._productionPlanService.productionPlan$.subscribe(
            (productionPlan) => {
                this.productionPlan = productionPlan;
            }
        );
    }

    getFormattedDate(date: string): string {
        const parsedDate = this.dateAdapter.parse(
            date,
            'yyyy-MM-ddTHH:mm:ss.SSS'
        );
        return this.dateAdapter.format(parsedDate, 'yyyy-MM-dd');
    }

    openProductionEstimationsDialog(
        productionEstimations: ProductionEstimation[]
    ) {
        this._dialog
            .open(EstimationsListComponent, {
                width: '520px',
                data: productionEstimations,
            })
            .afterClosed()
            .subscribe();
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

    openCreateBatchProductionPlanDialog(id: string) {
        this._productionPlanService
            .getBatchsInMonthPlan(id)
            .subscribe((batch) => {
                if (batch) {
                    this._dialog
                        .open(BatchsListComponent, {
                            data: id,
                            width: '480px',
                        })
                        .afterClosed()
                        .subscribe((result) => {
                            if (result === 'success') {
                                this.showFlashMessage(
                                    'success',
                                    'Create batch production plan successful',
                                    3000
                                );
                            }
                        });
                }
            });
    }

    approveProductionPlan(id: string) {
        this._productionPlanService
            .approveProductionPlan(id)
            .subscribe((response) => {
                this._productionPlanService
                    .getProductionPlanById(this.productionPlan.id)
                    .subscribe((productionPlan) => {
                        this.productionPlan = productionPlan;
                    });
            });
    }

    startProductionPlan(id: string) {
        this._productionPlanService
            .startProductionPlan(id)
            .subscribe((response) => {
                this._productionPlanService
                    .getProductionPlanById(this.productionPlan.id)
                    .subscribe((productionPlan) => {
                        this.productionPlan = productionPlan;
                    });
            });
    }

    declineProductionPlan(id: string) {
        this._productionPlanService
            .declineProductionPlan(id)
            .subscribe((response) => {
                this._productionPlanService
                    .getProductionPlanById(this.productionPlan.id)
                    .subscribe((productionPlan) => {
                        this.productionPlan = productionPlan;
                    });
            });
    }

    endProductionPlan(id: string) {
        this._productionPlanService
            .endProductionPlan(id)
            .subscribe((response) => {
                this._productionPlanService
                    .getProductionPlanById(this.productionPlan.id)
                    .subscribe((productionPlan) => {
                        this.productionPlan = productionPlan;
                    });
            });
    }

    deleteProductionPlan(id: string) {
        this._productionPlanService
            .deleteProductionPlan(id)
            .subscribe((response) => {
                this._productionPlanService
                    .getProductionPlanById(this.productionPlan.id)
                    .subscribe((productionPlan) => {
                        this.productionPlan = productionPlan;
                    });
            });
    }
}
