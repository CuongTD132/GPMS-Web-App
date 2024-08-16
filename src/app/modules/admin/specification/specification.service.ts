import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpecificationService {
    private _specification: BehaviorSubject<Specification | null> =
        new BehaviorSubject(null);
    private _specifications: BehaviorSubject<Specification[] | null> =
        new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {}
    /**
     * Getter for specifications
     */
    get specifications$(): Observable<Specification[]> {
        return this._specifications.asObservable();
    }

    get specification$(): Observable<Specification> {
        return this._specification.asObservable();
    }
    /**
     * Get specification by id
     */
    getSpecificationById(id: string): Observable<Specification> {
        return this.specifications$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .get<Specification>('/api/v1/specifications/' + id)
                    .pipe(
                        map((specification) => {
                            this._specification.next(specification);
                            return specification;
                        })
                    )
            )
        );
    }
}
