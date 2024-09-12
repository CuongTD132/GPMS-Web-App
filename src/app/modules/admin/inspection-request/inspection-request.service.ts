import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { BehaviorSubject, Observable, switchMap, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InspectionRequestService {
    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}
    private _inspectionRequest: BehaviorSubject<any[] | null> =
        new BehaviorSubject(null);
    get inspectionRequest$(): Observable<any[]> {
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
    createInspectionRequest(data) {
        return this.inspectionRequest$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient.post<any>('/api/v1/inspection-requests', data)
            )
        );
    }
}
