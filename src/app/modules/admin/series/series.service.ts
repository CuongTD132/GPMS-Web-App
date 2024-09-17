import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeriesService {
    private _series: BehaviorSubject<ProductionSeries[] | null> =
        new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}

    /**
     * Getter for Series
     */
    get series$(): Observable<ProductionSeries[]> {
        return this._series.asObservable();
    }
    /**
     * Getter for pagination
     */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getSeries(
        filter: any = {
            status: 'InInspection',
            pagination: {
                pageSize: 999,
            },
        }
    ): Observable<{ pagination: Pagination; data: ProductionSeries[] }> {
        return this._httpClient
            .post<{
                pagination: Pagination;
                data: ProductionSeries[];
            }>('/api/v1/series/filter', filter)
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._series.next(response.data);
                })
            );
    }

    getSeriesInProcess(id: string): Observable<ProductionSeries[]> {
        return this._httpClient.get<ProductionSeries[]>(
            '/api/v1/production-plans/' + id + '/in-production-series'
        );
    }
}
