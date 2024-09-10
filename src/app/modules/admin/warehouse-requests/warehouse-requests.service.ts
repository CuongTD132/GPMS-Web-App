import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WarehouseRequestService {
    private _warehouseRequest: BehaviorSubject<WarehouseRequest | null> =
        new BehaviorSubject(null);

    private _warehouseRequests: BehaviorSubject<WarehouseRequest[] | null> =
        new BehaviorSubject(null);

    private _patch: BehaviorSubject<Patch | null> = new BehaviorSubject(null);

    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject(null);

    private _productionPlans: BehaviorSubject<ProductionPlan[] | null> =
        new BehaviorSubject(null);

    get productionPlans$(): Observable<ProductionPlan[]> {
        return this._productionPlans.asObservable();
    }
    constructor(private _httpClient: HttpClient) {}

    /**
     * Getter for warehouseRequest
     */
    get warehouseRequest$(): Observable<WarehouseRequest> {
        return this._warehouseRequest.asObservable();
    }

    /**
     * Getter for warehouseRequests
     */
    get warehouseRequests$(): Observable<WarehouseRequest[]> {
        return this._warehouseRequests.asObservable();
    }

    get patch$(): Observable<Patch> {
        return this._patch.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getBatchPlanList(): Observable<ProductionPlan[]> {
        return this._httpClient
            .get<
                ProductionPlan[]
            >('/api/v1/production-plans/create-warehouse-requests')
            .pipe(
                map((res) => {
                    this._productionPlans.next(res);
                    return res;
                })
            );
    }

    getWarehouseRequests(
        filter: any = {}
    ): Observable<{ pagination: Pagination; data: WarehouseRequest[] }> {
        return this._httpClient
            .post<{
                pagination: Pagination;
                data: WarehouseRequest[];
            }>('/api/v1/warehouse-requests/filter', filter)
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._warehouseRequests.next(response.data);
                })
            );
    }

    /**
     * Get warehouseRequest by id
     */
    getWarehouseRequestById(id: string): Observable<WarehouseRequest> {
        return this.warehouseRequests$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .get<WarehouseRequest>('/api/v1/warehouse-requests/' + id)
                    .pipe(
                        map((warehouseRequest) => {
                            // Set value for current warehouseRequest
                            this._warehouseRequest.next(warehouseRequest);

                            // Return the new contact
                            return warehouseRequest;
                        })
                    )
            )
        );
    }

    /**
     * Create warehouseRequest
     */
    createWarehouseRequest(id: string) {
        return this.warehouseRequests$.pipe(
            take(1),
            switchMap((warehouseRequests) =>
                this._httpClient
                    .post<WarehouseRequest>(
                        '/api/v1/warehouse-requests/production-plan/' + id,
                        null
                    )
                    .pipe(
                        map((newWarehouseRequest) => {
                            this._warehouseRequests.next(
                                [
                                    newWarehouseRequest,
                                    ...warehouseRequests,
                                ].slice(0, this._pagination.value.pageSize)
                            );

                            return newWarehouseRequest;
                        })
                    )
            )
        );
    }

    /**
     * Approve warehouseRequest
     */
    approveWarehouseRequest(id: string) {
        return this.patch$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .patch<Patch>(
                        '/api/v1/warehouse-requests/' + id + '/approve',
                        null
                    )
                    .pipe(
                        tap((response) => {
                            this._patch.next(response);
                        })
                    )
            )
        );
    }

    /**
     * Decline warehouseRequest
     */
    declineWarehouseRequest(id: string, data) {
        return this.patch$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .patch<Patch>(
                        '/api/v1/warehouse-requests/' + id + '/decline',
                        data
                    )
                    .pipe(
                        tap((response) => {
                            this._patch.next(response);
                        })
                    )
            )
        );
    }
}
