import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomPipeModule } from '@fuse/pipes/pipe.module';
import { Observable } from 'rxjs';
import { CreateMonthProductionPlanComponent } from '../../../create/month/create-production-plan.component';
import { ProductionPlanService } from '../../../production-plan.service';
@Component({
    selector: 'months-list',
    standalone: true,
    templateUrl: './months-list.component.html',
    styleUrls: ['./months-list.component.css'],
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
        MatCheckboxModule,
        MatChipsModule,
        CustomPipeModule,
        MatTooltipModule,
    ],
})
export class MonthsListComponent implements OnInit {
    monthsLists$: Observable<MonthAndSpecs[]>;
    previewUrl: string | ArrayBuffer;
    selectedFile: File;
    uploadMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    parentId: string;
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: string,
        private _dialog: MatDialog,
        public matDialogRef: MatDialogRef<MonthsListComponent>,
        private _productionPlanService: ProductionPlanService
    ) {}

    ngOnInit(): void {
        this.parentId = this.data;
        this.getProductionPlans();
    }

    private getProductionPlans() {
        this.monthsLists$ = this._productionPlanService.months$;
    }

    add(item: Reqs[]) {
        const data = { item, parentId: this.parentId };
        this._dialog
            .open(CreateMonthProductionPlanComponent, {
                data: data,
                width: '720px',
            })
            .afterClosed()
            .subscribe((result) => {
                console.log(result);
            });
        this.matDialogRef.close();
    }
}
