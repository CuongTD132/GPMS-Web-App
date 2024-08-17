import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StepService {
    private _step: BehaviorSubject<Step | null> = new BehaviorSubject(null);
    private _steps: BehaviorSubject<Step[] | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {}
    /**
     * Getter for steps
     */
    get steps$(): Observable<Step[]> {
        return this._steps.asObservable();
    }

    get step$(): Observable<Step> {
        return this._step.asObservable();
    }
    /**
     * Get step by id
     */
    getStepById(id: string): Observable<Step> {
        return this.steps$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient.get<Step>('/api/v1/steps/' + id).pipe(
                    map((step) => {
                        this._step.next(step);
                        return step;
                    })
                )
            )
        );
    }
}
