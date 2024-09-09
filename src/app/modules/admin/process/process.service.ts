import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProcessService {
    private _process: BehaviorSubject<Process | null> = new BehaviorSubject(
        null
    );
    private _processes: BehaviorSubject<Process[] | null> = new BehaviorSubject(
        null
    );

    constructor(private _httpClient: HttpClient) {}
    /**
     * Getter for processes
     */
    get processes$(): Observable<Process[]> {
        return this._processes.asObservable();
    }

    get process$(): Observable<Process> {
        return this._process.asObservable();
    }
    /**
     * Get process by id
     */
    getProcessById(id: string): Observable<Process> {
        return this.processes$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient.get<Process>('/api/v1/processes/' + id).pipe(
                    map((process) => {
                        this._process.next(process);
                        return process;
                    })
                )
            )
        );
    }

    getProcessListBySeriesId(id: string): Observable<Process[]> {
        return this.processes$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .get<Process[]>('/api/v1/series/' + id + '/processes')
                    .pipe(
                        tap((response) => {
                            this._processes.next(response);
                        })
                    )
            )
        );
    }
}
