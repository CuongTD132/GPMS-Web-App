import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { ProductionPlanService } from '../../production-plan.service';
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
    ],
})
export class ProductionPlanBatchDetailComponent implements OnInit {
    productionPlan: ProductionPlan;
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    updateProductionPlanForm: UntypedFormGroup;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _productionPlanService: ProductionPlanService,
        private _dialog: MatDialog,
        private dateAdapter: DateAdapter<Date>
    ) {}

    ngOnInit(): void {
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
}
