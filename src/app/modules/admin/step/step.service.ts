import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StepService {
    private _step: BehaviorSubject<StepDetail | null> = new BehaviorSubject(
        null
    );
    private _steps: BehaviorSubject<Step[] | null> = new BehaviorSubject(null);

    private _stepIOs: BehaviorSubject<IORespone | null> = new BehaviorSubject(
        null
    );

    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}
    /**
     * Getter for steps
     */
    get steps$(): Observable<Step[]> {
        return this._steps.asObservable();
    }

    get step$(): Observable<StepDetail> {
        return this._step.asObservable();
    }

    get stepIOs$(): Observable<IORespone> {
        return this._stepIOs.asObservable();
    }
    /**
     * Get step by id
     */
    getStepById(id: string): Observable<StepDetail> {
        return this.steps$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient.get<StepDetail>('/api/v1/steps/' + id).pipe(
                    map((step) => {
                        this._step.next(step);
                        return step;
                    })
                )
            )
        );
    }

    getStepListByProcessId(
        id: string
    ): Observable<{ pagination: Pagination; data: Step[] }> {
        return this._httpClient
            .post<{
                pagination: Pagination;
                data: Step[];
            }>('/api/v1/processes/' + id + '/steps/filter', {
                pagination: {
                    pageSize: 999,
                },
            })
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._steps.next(response.data);
                })
            );
    }

    getStepListByProcessIdAndSeriesId(
        id: string,
        seriesId: string
    ): Observable<Step[]> {
        return this.steps$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .get<
                        Step[]
                    >('/api/v1/processes/' + id + '/series/' + seriesId + '/steps')
                    .pipe(
                        tap((step) => {
                            this._steps.next(step);
                            return step;
                        })
                    )
            )
        );
    }

    getStepIOListByStepId(id: string, seriesId: string): Observable<IORespone> {
        return this.stepIOs$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .get<IORespone>(
                        '/api/v1/steps/' +
                            id +
                            '/series/' +
                            seriesId +
                            '/step-input-outputs/step-results'
                    )
                    .pipe(
                        map((stepIO) => {
                            this._stepIOs.next(stepIO);
                            return stepIO;
                        })
                    )
            )
        );
    }

    createStepResult(id: string, data) {
        return this._httpClient.post<IORespone>(
            '/api/v1/series/' + id + '/production-process-step-results',
            data
        );
    }
}
