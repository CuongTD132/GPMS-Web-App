import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductionProcessStepIOService {
    private _productionProcessStepIO: BehaviorSubject<StepIO | null> =
        new BehaviorSubject(null);
    private _productionProcessStepIOs: BehaviorSubject<StepIO[] | null> =
        new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}

    /**
     * Getter for productionProcessStepIO
     */
    get productionProcessStepIO$(): Observable<StepIO> {
        return this._productionProcessStepIO.asObservable();
    }

    /**
     * Getter for productionProcessStepIOs
     */
    get productionProcessStepIOs$(): Observable<StepIO[]> {
        return this._productionProcessStepIOs.asObservable();
    }
    /**
     * Getter for pagination
     */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getProductionProcessStepIOs(
        id: string,
        filter: any = {}
    ): Observable<{ pagination: Pagination; data: StepIO[] }> {
        return this._httpClient
            .post<{
                pagination: Pagination;
                data: StepIO[];
            }>('/api/v1/steps/' + id + '/step-input-outputs/filter', {
                pagination: {
                    pageSize: 999,
                },
            })
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._productionProcessStepIOs.next(response.data);
                })
            );
    }
}
