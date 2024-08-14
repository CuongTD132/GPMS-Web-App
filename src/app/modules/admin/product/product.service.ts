import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private _product: BehaviorSubject<Product | null> = new BehaviorSubject(
        null
    );
    private _products: BehaviorSubject<Product[] | null> = new BehaviorSubject(
        null
    );
    private _pagination: BehaviorSubject<Pagination | null> =
        new BehaviorSubject(null);
    private _productPatch: BehaviorSubject<Patch | null> = new BehaviorSubject(
        null
    );
    constructor(private _httpClient: HttpClient) {}

    /**
     * Getter for product
     */
    get product$(): Observable<Product> {
        return this._product.asObservable();
    }

    /**
     * Getter for getMonthsInYearPlan
     */
    get productPatch$(): Observable<Patch> {
        return this._productPatch.asObservable();
    }

    /**
     * Getter for products
     */
    get products$(): Observable<Product[]> {
        return this._products.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getProducts(
        filter: any = {}
    ): Observable<{ pagination: Pagination; data: Product[] }> {
        return this._httpClient
            .post<{
                pagination: Pagination;
                data: Product[];
            }>('/api/v1/products/filter', filter)
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination);
                    this._products.next(response.data);
                })
            );
    }

    /**
     * Get product by id
     */
    getProductById(id: string): Observable<Product> {
        return this.products$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient.get<Product>('/api/v1/products/' + id).pipe(
                    map((product) => {
                        // Set value for current product
                        this._product.next(product);

                        // Return the new contact
                        return product;
                    })
                )
            )
        );
    }

    /**
     * Create product
     */
    createProduct(data) {
        return this.products$.pipe(
            take(1),
            switchMap((products) =>
                this._httpClient.post<Product>('/api/v1/products', data).pipe(
                    map((newProduct) => {
                        // Update product list with current page size
                        this._products.next(
                            [newProduct, ...products].slice(
                                0,
                                this._pagination.value.pageSize
                            )
                        );

                        return newProduct;
                    })
                )
            )
        );
    }

    approveProduct(id: string) {
        return this.productPatch$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .patch<Patch>('/api/v1/products/' + id + '/approve', null)
                    .pipe(
                        tap((response) => {
                            this._productPatch.next(response);
                        })
                    )
            )
        );
    }

    declineProduct(id: string) {
        return this.productPatch$.pipe(
            take(1),
            switchMap(() =>
                this._httpClient
                    .patch<Patch>('/api/v1/products/' + id + '/decline', null)
                    .pipe(
                        tap((response) => {
                            this._productPatch.next(response);
                        })
                    )
            )
        );
    }
    /**
     * Update product
     */
    updateProduct(id: string, data) {
        return this.products$.pipe(
            take(1),
            switchMap((products) =>
                this._httpClient
                    .put<Product>('/api/v1/products/' + id, data)
                    .pipe(
                        map((updatedProduct) => {
                            // Find and replace updated product
                            const index = products.findIndex(
                                (item) => item.id === id
                            );
                            products[index] = updatedProduct;
                            this._products.next(products);

                            // Update product
                            this._product.next(updatedProduct);

                            return updatedProduct;
                        })
                    )
            )
        );
    }

    deleteProduct(id: string): Observable<boolean> {
        return this.products$.pipe(
            take(1),
            switchMap((products) =>
                this._httpClient.delete('/api/products/' + id).pipe(
                    map((isDeleted: boolean) => {
                        // Find the index of the deleted product
                        const index = products.findIndex(
                            (item) => item.id === id
                        );

                        // Delete the product
                        products.splice(index, 1);

                        // Update the products
                        this._products.next(products);

                        // Return the deleted status
                        return isDeleted;
                    })
                )
            )
        );
    }
}
