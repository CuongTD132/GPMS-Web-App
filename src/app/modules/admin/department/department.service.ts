import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
    private _department: BehaviorSubject<Department | null> =
        new BehaviorSubject(null);
    private _departmentInfo: BehaviorSubject<DepartmentDetail | null> =
        new BehaviorSubject(null);
    private _departments: BehaviorSubject<Department[] | null> =
        new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}

    /**
     * Getter for department
     */
    get department$(): Observable<Department> {
        return this._department.asObservable();
    }
    get _departmentInfo$(): Observable<DepartmentDetail> {
        return this._departmentInfo.asObservable();
    }
    /**
     * Getter for departments
     */
    get departments$(): Observable<Department[]> {
        return this._departments.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getDepartments(
        filter: any = {}
    ): Observable<{ pagination: Pagination; data: Department[] }> {
        return this._httpClient
            .post<{
                pagination: Pagination;
                data: Department[];
            }>('/api/v1/departments/filter', filter)
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._departments.next(response.data);
                })
            );
    }

    /**
     * Get department by id
     */
    getDepartmentById(id: string): Observable<DepartmentDetail> {
        return this._departmentInfo$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .get<DepartmentDetail>(
                        '/api/v1/departments/' + id + '/staffs'
                    )
                    .pipe(
                        map((department) => {
                            // Set value for current department
                            this._departmentInfo.next(department);

                            // Return the new contact
                            return department;
                        })
                    )
            )
        );
    }

    /**
     * Create department
     */
    createDepartment(data) {
        return this.departments$.pipe(
            take(1),
            switchMap((departments) =>
                this._httpClient
                    .post<Department>('/api/departments', data)
                    .pipe(
                        map((newDepartment) => {
                            // Update department list with current page size
                            this._departments.next(
                                [newDepartment, ...departments].slice(
                                    0,
                                    this._pagination.value.pageSize
                                )
                            );

                            return newDepartment;
                        })
                    )
            )
        );
    }

    /**
     * Update department
     */
    updateDepartment(id: string, data) {
        return this.departments$.pipe(
            take(1),
            switchMap((departments) =>
                this._httpClient
                    .put<Department>('/api/departments/' + id, data)
                    .pipe(
                        map((updatedDepartment) => {
                            // Find and replace updated department
                            const index = departments.findIndex(
                                (item) => item.id === id
                            );
                            departments[index] = updatedDepartment;
                            this._departments.next(departments);

                            // Update department
                            this._department.next(updatedDepartment);

                            return updatedDepartment;
                        })
                    )
            )
        );
    }

    deleteDepartment(id: string): Observable<boolean> {
        return this.departments$.pipe(
            take(1),
            switchMap((departments) =>
                this._httpClient.delete('/api/departments/' + id).pipe(
                    map((isDeleted: boolean) => {
                        // Find the index of the deleted product
                        const index = departments.findIndex(
                            (item) => item.id === id
                        );

                        // Delete the product
                        departments.splice(index, 1);

                        // Update the departments
                        this._departments.next(departments);

                        // Return the deleted status
                        return isDeleted;
                    })
                )
            )
        );
    }
}
