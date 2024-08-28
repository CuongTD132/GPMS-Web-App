import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _httpClient = inject(HttpClient);
    private _authService = inject(UserService);
    private _navigation: ReplaySubject<Navigation> =
        new ReplaySubject<Navigation>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation> {
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) => {
                console.log(navigation);

                this._navigation.next(navigation);
            })
        );
    }

    private filterNavByPermission(navigation: Navigation) {
        navigation.compact;
    }
}
