import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SemiService {
    private _semi: BehaviorSubject<SemiFinishedProduct | null> =
        new BehaviorSubject(null);
    private _semies: BehaviorSubject<SemiFinishedProduct[] | null> =
        new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}

    /**
     * Getter for semi
     */
    get semi$(): Observable<SemiFinishedProduct> {
        return this._semi.asObservable();
    }

    /**
     * Getter for semies
     */
    get semies$(): Observable<SemiFinishedProduct[]> {
        return this._semies.asObservable();
    }
    /**
     * Getter for pagination
     */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getSemies(
        id: string,
        filter: any = {}
    ): Observable<{ pagination: Pagination; data: SemiFinishedProduct[] }> {
        return this._httpClient
            .post<{
                pagination: Pagination;
                data: SemiFinishedProduct[];
            }>('/api/v1/products/' + id + '/semi-finished-products/filter', {
                pagination: {
                    pageSize: 999,
                },
            })
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._semies.next(response.data);
                })
            );
    }
}
