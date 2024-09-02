import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SizeService {
    private _sizes: BehaviorSubject<string[] | null> = new BehaviorSubject(
        null
    );

    get sizes$(): Observable<string[]> {
        return this._sizes.asObservable();
    }
    constructor(private _httpClient: HttpClient) {}

    getSizesList(): Observable<string[]> {
        return this._httpClient
            .get<string[]>('/api/v1/sizes/on-create-product')
            .pipe(
                map((sizes) => {
                    this._sizes.next(sizes);
                    return sizes;
                })
            );
    }
}
