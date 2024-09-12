import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getRouteForRole } from 'app/app.routes';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { UserService } from '../user/user.service';
import { User } from '../user/user.types';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _user: User;
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
                // this.userPermission = this._authService.user.role;

                this._authService.user$.subscribe((user) => {
                    this._user = user;
                });

                const filteredNav = this.filterNavByPermission(
                    navigation,
                    this._user.role
                );
                getRouteForRole(this._user.role);
                this._navigation.next(filteredNav);
            })
        );
    }

    filterNavByPermission(nav: Navigation, permissionString): Navigation {
        const filteredNav = {};

        for (const key in nav) {
            if (nav.hasOwnProperty(key)) {
                filteredNav[key] = nav[key].filter((item) =>
                    item.permissions.includes(permissionString)
                );
            }
        }

        return filteredNav as Navigation;
    }
}
