import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { environment } from 'environments/environment.prod';
import { Observable, catchError, throwError } from 'rxjs';
import { ErrorService } from '../error/error.service';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const errorService = inject(ErrorService);
    const baseUrl = environment.apiURL;

    // Clone the request object
    let newReq = req.clone();
    if (req.url.startsWith('/')) {
        newReq = req.clone({
            url: baseUrl + req.url,
        });
    }

    // Request
    //
    // If the access token didn't expire, add the Authorization header.
    // We won't add the Authorization header if the access token expired.
    // This will force the server to return a "401 Unauthorized" response
    // for the protected API routes which our response interceptor will
    // catch and delete the access token from the local storage while logging
    // the user out from the app.
    if (
        authService.accessToken &&
        !AuthUtils.isTokenExpired(authService.accessToken)
    ) {
        if (req.url.startsWith('/')) {
            newReq = req.clone({
                url: baseUrl + req.url,
                headers: req.headers.set(
                    'Authorization',
                    'Bearer ' + authService.accessToken
                ),
            });
        }
    }

    // Response
    return next(newReq).pipe(
        catchError((error) => {
            // Catch "401 Unauthorized" responses
            if (error instanceof HttpErrorResponse && error.status === 401) {
                // Sign out
                authService.signOut();

                // Reload the app
                location.reload();
            }
            // ${key}:
            if (error && error.status === 400) {
                const errors = error.error.errors;
                let message = [];

                Object.keys(errors).forEach((key) => {
                    message.push(`${errors[key]}`);
                });

                errorService.showBadRequestError(message);
            }
            if (error instanceof HttpErrorResponse && error.status === 403) {
                errorService.showBadRequestError([
                    'You do not have permission!',
                ]);
            }

            if (error instanceof HttpErrorResponse && error.status === 500) {
                errorService.showServerError(error.error.message);
            }

            if (error instanceof HttpErrorResponse && error.status === 409) {
                errorService.showConflictError(error.error);
            }

            return throwError(error);
        })
    );
};
