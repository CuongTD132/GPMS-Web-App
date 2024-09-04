import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductionResultService } from './production-results.service';

@Component({
    selector: 'production-results',
    standalone: true,
    templateUrl: './production-results.component.html',
    styleUrls: ['./production-results.component.css'],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatChipsModule,
        RouterModule,
    ],
})
export class ProductionResultComponent implements OnInit {
    productionPlans$: Observable<ProductionPlan[]>;

    constructor(
        private _productionResultService: ProductionResultService,
        private dateAdapter: DateAdapter<Date>
    ) {}
    ngOnInit(): void {
        this.getProductionPlans();
    }

    private getProductionPlans() {
        this.productionPlans$ = this._productionResultService.productionPlans$;
    }

    getFormattedDate(date: string): string {
        const parsedDate = this.dateAdapter.parse(
            date,
            'yyyy-MM-ddTHH:mm:ss.SSS'
        );
        return this.dateAdapter.format(parsedDate, 'yyyy-MM-dd');
    }
}
