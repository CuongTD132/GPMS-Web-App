import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MeasurementService {
    private _measurements: BehaviorSubject<Measurement[] | null> =
        new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}

    /**
     * Getter for Measurements
     */
    get measurements$(): Observable<Measurement[]> {
        return this._measurements.asObservable();
    }
    /**
     * Getter for pagination
     */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getMeasurements(
        id: string,
        filter: any = {}
    ): Observable<{ pagination: Pagination; data: Measurement[] }> {
        return this._httpClient
            .post<{
                pagination: Pagination;
                data: Measurement[];
            }>('/api/v1/specifications/' + id + '/measurements/filter', {
                pagination: {
                    pageSize: 999,
                },
            })
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._measurements.next(response.data);
                })
            );
    }
}
