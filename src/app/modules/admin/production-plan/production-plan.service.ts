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
    private _batchs: BehaviorSubject<BatchAndSpecs[] | null> =
        new BehaviorSubject(null);
    private _productionPlanPatch: BehaviorSubject<Patch | null> =
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
     * Getter for getBatchsInMonthPlan
     */
    get batch$(): Observable<BatchAndSpecs[]> {
        return this._batchs.asObservable();
    }

    /**
     * Getter for getMonthsInYearPlan
     */
    get productionPlanPatch$(): Observable<Patch> {
        return this._productionPlanPatch.asObservable();
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

    /**
     * Get all month and specifications for create month plan by id
     */
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
     * Get all batch and specifications for create month plan by id
     */
    getBatchsInMonthPlan(id: string): Observable<BatchAndSpecs[]> {
        return this.months$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .post<
                        BatchAndSpecs[]
                    >('/api/v1/production-plans/' + id + '/create-month-plan/batchs', null)
                    .pipe(
                        tap((response) => {
                            this._batchs.next(response);
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
     * Approve productionPlan
     */
    approveProductionPlan(id: string) {
        return this.productionPlanPatch$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .patch<Patch>(
                        '/api/v1/production-plans/' + id + '/approve',
                        null
                    )
                    .pipe(
                        tap((response) => {
                            this._productionPlanPatch.next(response);
                        })
                    )
            )
        );
    }

    /**
     * Start productionPlan
     */
    startProductionPlan(id: string) {
        return this.productionPlanPatch$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .patch<Patch>(
                        '/api/v1/production-plans/' + id + '/start',
                        null
                    )
                    .pipe(
                        tap((response) => {
                            this._productionPlanPatch.next(response);
                        })
                    )
            )
        );
    }

    /**
     * Decline productionPlan
     */
    declineProductionPlan(id: string) {
        return this.productionPlanPatch$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .patch<Patch>(
                        '/api/v1/production-plans/' + id + '/decline',
                        null
                    )
                    .pipe(
                        tap((response) => {
                            this._productionPlanPatch.next(response);
                        })
                    )
            )
        );
    }
}
