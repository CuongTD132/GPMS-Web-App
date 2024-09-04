import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductionResultService {
    private _productionPlans: BehaviorSubject<ProductionPlan[] | null> =
        new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}

    get productionPlans$(): Observable<ProductionPlan[]> {
        return this._productionPlans.asObservable();
    }

    getBatchProductionPlansInProgress(
        filter: any = {
            type: 'batch',
            status: 'InProgress',
        }
    ): Observable<{ data: ProductionPlan[] }> {
        return this._httpClient
            .post<{
                data: ProductionPlan[];
            }>('/api/v1/production-plans/filter', filter)
            .pipe(
                tap((response) => {
                    this._productionPlans.next(response.data);
                })
            );
    }
}
