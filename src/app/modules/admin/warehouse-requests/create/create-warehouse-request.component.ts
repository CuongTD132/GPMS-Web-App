import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { WarehouseRequestService } from '../warehouse-requests.service';

@Component({
    selector: 'create-warehouse-request',
    standalone: true,
    templateUrl: './create-warehouse-request.component.html',
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
export class CreateWarehouseRequestComponent implements OnInit {
    selectedProPlan: string = null;
    id: string = null;
    createForm: FormGroup;
    productionPlans$: Observable<ProductionPlan[]>;
    constructor(
        public matDialogRef: MatDialogRef<CreateWarehouseRequestComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ProductionPlan[],
        private _warehouseRequestService: WarehouseRequestService
    ) {}

    ngOnInit(): void {}

    getSelectedId(id: string) {
        this.id = id;
    }

    create() {
        if (this.id) {
            this._warehouseRequestService
                .createWarehouseRequest(this.id)
                .subscribe({
                    next: (result) => {
                        this.matDialogRef.close('success');
                    },
                    error: (err) => {
                        this.matDialogRef.close('error');
                    },
                });
        }
    }
}
