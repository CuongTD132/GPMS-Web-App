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
import { CustomPipeModule } from '@fuse/pipes/pipe.module';
import { UserService } from 'app/core/user/user.service';
import { ProductionPlanService } from '../../production-plan.service';
import { DeclineComponent } from './decline/decline.component';
import { EstimationsListComponent } from './estimations-list/estimations-list.component';

@Component({
    selector: '  batch-production-plan-detail',
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
        RouterModule,
        MatTooltipModule,
        CustomPipeModule,
        MatMenuModule,
    ],
})
export class ProductionPlanBatchDetailComponent implements OnInit {
    productionPlan: ProductionPlan;
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    updateProductionPlanForm: UntypedFormGroup;
    flashMessage: 'success' | 'error' | null = null;
    role: string = null;
    message: string = null;
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _productionPlanService: ProductionPlanService,
        private _userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _dialog: MatDialog,
        private dateAdapter: DateAdapter<Date>
    ) {}

    ngOnInit(): void {
        this._userService.get().subscribe((user) => {
            this.role = user.role;
        });
        this._productionPlanService.productionPlan$.subscribe(
            (productionPlan) => {
                this.productionPlan = productionPlan;
                this.initProductionPlanForm();
            }
        );
    }

    initProductionPlanForm() {
        this.updateProductionPlanForm = this._formBuilder.group({
            name: [this.productionPlan.name, [Validators.required]],
            code: [this.productionPlan.code, [Validators.required]],
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
                width: '620px',
                data: productionEstimations,
            })
            .afterClosed()
            .subscribe();
    }

    approveProductionPlan(id: string) {
        this._productionPlanService.approveProductionPlan(id).subscribe({
            next: () => {
                this._productionPlanService
                    .getProductionPlanById(this.productionPlan.id)
                    .subscribe((productionPlan) => {
                        this.productionPlan = productionPlan;
                    });
                this.showFlashMessage(
                    'success',
                    'Production plan has been aprrove successful',
                    3000
                );
            },
            error: () =>
                this.showFlashMessage(
                    'error',
                    'Production plan has been aprrove failed',
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
                //console.log(result);

                if (result === 'success') {
                    this._productionPlanService
                        .getProductionPlanById(this.productionPlan.id)
                        .subscribe((res) => {
                            this.showFlashMessage(
                                'success',
                                'Production plan has been decline successful',
                                3000
                            );
                        });
                }
                if (result === 'error') {
                    this.showFlashMessage(
                        'error',
                        'Production plan has been decline failed',
                        3000
                    );
                }
            });
    }

    deleteProductionPlan(id: string) {
        this._productionPlanService.deleteProductionPlan(id).subscribe({
            next: () => {
                this._productionPlanService
                    .getProductionPlanById(this.productionPlan.id)
                    .subscribe((productionPlan) => {
                        this.productionPlan = productionPlan;
                    });
                this.showFlashMessage(
                    'success',
                    'Production plan has been delete successful',
                    3000
                );
            },
            error: () =>
                this.showFlashMessage(
                    'error',
                    'Production plan has been delete failed',
                    3000
                ),
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
}
