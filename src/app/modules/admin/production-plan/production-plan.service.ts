import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductionPlanService {
    private _productionPlan: BehaviorSubject<ProductionPlan | null> =
        new BehaviorSubject(null);
    private _productionPlans: BehaviorSubject<ProductionPlan[] | null> =
        new BehaviorSubject(null);
    private _months: BehaviorSubject<MonthAndSpecs[] | null> =
        new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}

    /**
     * Getter for productionPlan
     */
    get productionPlan$(): Observable<ProductionPlan> {
        return this._productionPlan.asObservable();
    }

    /**
     * Getter for productionPlans
     */
    get productionPlans$(): Observable<ProductionPlan[]> {
        return this._productionPlans.asObservable();
    }

    /**
     * Getter for getMonthsInYearPlan
     */
    get months$(): Observable<MonthAndSpecs[]> {
        return this._months.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getProductionPlans(
        filter: any = {}
    ): Observable<{ pagination: Pagination; data: ProductionPlan[] }> {
        return this._httpClient
            .post<{
                pagination: Pagination;
                data: ProductionPlan[];
            }>('/api/v1/production-plans/filter/year', filter)
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._productionPlans.next(response.data);
                })
            );
    }

    /**
     * Get productionPlan by id
     */
    getProductionPlanById(id: string): Observable<ProductionPlan> {
        return this.productionPlans$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .get<ProductionPlan>('/api/v1/production-plans/' + id)
                    .pipe(
                        map((productionPlan) => {
                            // Set value for current productionPlan
                            this._productionPlan.next(productionPlan);

                            // Return the new contact
                            return productionPlan;
                        })
                    )
            )
        );
    }

    getMonthsInYearPlan(id: string): Observable<MonthAndSpecs[]> {
        return this.months$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .post<
                        MonthAndSpecs[]
                    >('/api/v1/production-plans/' + id + '/create-month-plan/months', null)
                    .pipe(
                        tap((response) => {
                            this._months.next(response);
                        })
                    )
            )
        );
    }

    /**
     * Create productionPlan
     */
    createYearProductionPlan(data) {
        return this.productionPlans$.pipe(
            take(1),
            switchMap((productionPlans) =>
                this._httpClient
                    .post<ProductionPlan>(
                        '/api/v1/production-plans/annual',
                        data
                    )
                    .pipe(
                        map((newProductionPlan) => {
                            // Update productionPlan list with current page size
                            this._productionPlans.next(
                                [newProductionPlan, ...productionPlans].slice(
                                    0,
                                    this._pagination.value.pageSize
                                )
                            );

                            return newProductionPlan;
                        })
                    )
            )
        );
    }

    createChildProductionPlan(data) {
        return this.productionPlans$.pipe(
            take(1),
            switchMap((productionPlans) =>
                this._httpClient
                    .post<ProductionPlan>(
                        '/api/v1/production-plans/child',
                        data
                    )
                    .pipe(
                        map((newProductionPlan) => {
                            // Update productionPlan list with current page size
                            this._productionPlans.next(
                                [newProductionPlan, ...productionPlans].slice(
                                    0,
                                    this._pagination.value.pageSize
                                )
                            );

                            return newProductionPlan;
                        })
                    )
            )
        );
    }

    /**
     * Update productionPlan
     */
    updateProductionPlan(id: string, data) {
        return this.productionPlans$.pipe(
            take(1),
            switchMap((productionPlans) =>
                this._httpClient
                    .put<ProductionPlan>('/api/v1/production-plans/' + id, data)
                    .pipe(
                        map((updatedProductionPlan) => {
                            // Find and replace updated productionPlan
                            const index = productionPlans.findIndex(
                                (item) => item.id === id
                            );
                            productionPlans[index] = updatedProductionPlan;
                            this._productionPlans.next(productionPlans);

                            // Update productionPlan
                            this._productionPlan.next(updatedProductionPlan);

                            return updatedProductionPlan;
                        })
                    )
            )
        );
    }

    deleteProductionPlan(id: string): Observable<boolean> {
        return this.productionPlans$.pipe(
            take(1),
            switchMap((productionPlans) =>
                this._httpClient.delete('/api/production-plans/' + id).pipe(
                    map((isDeleted: boolean) => {
                        // Find the index of the deleted product
                        const index = productionPlans.findIndex(
                            (item) => item.id === id
                        );

                        // Delete the product
                        productionPlans.splice(index, 1);

                        // Update the productionPlans
                        this._productionPlans.next(productionPlans);

                        // Return the deleted status
                        return isDeleted;
                    })
                )
            )
        );
    }
}
