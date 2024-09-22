import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { BehaviorSubject, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InspectionRequestService {
    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}
    private _inspectionRequests: BehaviorSubject<InspectionRequest[] | null> =
        new BehaviorSubject(null);

    private _inspectionRequest: BehaviorSubject<InspectionRequest | null> =
        new BehaviorSubject(null);
    get inspectionRequests$(): Observable<InspectionRequest[]> {
        return this._inspectionRequests.asObservable();
    }
    get inspectionRequest$(): Observable<InspectionRequest> {
        return this._inspectionRequest.asObservable();
    }
    /**
     * Getter for pagination
     */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    /**
     * Create warehouseRequest
     */

    getInspectionRequests(
        filter: any = {}
    ): Observable<{ pagination: Pagination; data: InspectionRequest[] }> {
        return this._httpClient
            .post<{
                pagination: Pagination;
                data: InspectionRequest[];
            }>('/api/v1/inspection-requests/filter', filter)
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._inspectionRequests.next(response.data);
                })
            );
    }

    createInspectionRequest(data) {
        return this.inspectionRequest$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient.post<any>('/api/v1/inspection-requests', data)
            )
        );
    }
}
