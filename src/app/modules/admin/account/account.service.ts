import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private _account: BehaviorSubject<Account | null> = new BehaviorSubject(
        null
    );
    private _accountInfo: BehaviorSubject<AccountInfo | null> =
        new BehaviorSubject(null);
    private _accounts: BehaviorSubject<Account[] | null> = new BehaviorSubject(
        null
    );
    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}

    /**
     * Getter for account
     */
    get account$(): Observable<Account> {
        return this._account.asObservable();
    }
    get accountInfo$(): Observable<AccountInfo> {
        return this._accountInfo.asObservable();
    }

    /**
     * Getter for accounts
     */
    get accounts$(): Observable<Account[]> {
        return this._accounts.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getAccounts(
        filter: any = {}
    ): Observable<{ pagination: Pagination; data: Account[] }> {
        return this._httpClient
            .post<{
                pagination: Pagination;
                data: Account[];
            }>('/api/v1/accounts/filter', filter)
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._accounts.next(response.data);
                })
            );
    }

    /**
     * Get account by id
     */
    getAccountById(id: string): Observable<AccountInfo> {
        return this.accountInfo$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .get<AccountInfo>('/api/v1/accounts/' + id)
                    .pipe(
                        map((account) => {
                            // Set value for current account
                            this._accountInfo.next(account);

                            // Return the new contact
                            return account;
                        })
                    )
            )
        );
    }

    /**
     * Create account
     */
    createAccount(data) {
        return this.accounts$.pipe(
            take(1),
            switchMap((accounts) =>
                this._httpClient.post<Account>('/api/accounts', data).pipe(
                    map((newAccount) => {
                        // Update account list with current page size
                        this._accounts.next(
                            [newAccount, ...accounts].slice(
                                0,
                                this._pagination.value.pageSize
                            )
                        );

                        return newAccount;
                    })
                )
            )
        );
    }

    /**
     * Update account
     */
    updateAccount(id: string, data) {
        return this.accounts$.pipe(
            take(1),
            switchMap((accounts) =>
                this._httpClient.put<Account>('/api/accounts/' + id, data).pipe(
                    map((updatedAccount) => {
                        // Find and replace updated account
                        const index = accounts.findIndex(
                            (item) => item.id === id
                        );
                        accounts[index] = updatedAccount;
                        this._accounts.next(accounts);

                        // Update account
                        this._account.next(updatedAccount);

                        return updatedAccount;
                    })
                )
            )
        );
    }

    deleteAccount(id: string): Observable<boolean> {
        return this.accounts$.pipe(
            take(1),
            switchMap((accounts) =>
                this._httpClient.delete('/api/accounts/' + id).pipe(
                    map((isDeleted: boolean) => {
                        // Find the index of the deleted product
                        const index = accounts.findIndex(
                            (item) => item.id === id
                        );

                        // Delete the product
                        accounts.splice(index, 1);

                        // Update the accounts
                        this._accounts.next(accounts);

                        // Return the deleted status
                        return isDeleted;
                    })
                )
            )
        );
    }
}
