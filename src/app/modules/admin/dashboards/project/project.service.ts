import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    // getData(): Observable<any> {
    //     return this._httpClient.get('api/dashboards/project').pipe(
    //         tap((response: any) => {
    //             this._data.next(response);
    //         })
    //     );
    // }

    // getData(): Observable<any> {
    //     return this._httpClient.get('api/dashboards/analytics').pipe(
    //         tap((response: any) => {
    //             this._data.next(response);
    //         })
    //     );
    // }

    getData(): Observable<any> {
        return this._httpClient
            .post('/api/v1/production-plans/dashboard', null)
            .pipe(
                tap((response: any) => {
                    //console.log(response);

                    this._data.next(response);
                })
            );
    }
}
