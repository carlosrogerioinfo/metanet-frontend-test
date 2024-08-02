import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BaseService } from "src/app/services/base.service";
import { ProductResponse } from "../models/product";
import { LocalStorageUtils } from "../utils/localstorage";

@Injectable()
export class ProductService extends BaseService {

    constructor(private http: HttpClient, private storage: LocalStorageUtils) { super(); }

    private token = this.storage.getTokenFromStorage();

    get() : Observable<ProductResponse>{

        let response = this.http
            .get(this.UrlService + '/product/get-all', this.getHeaderAuthJson(this.token))
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }

    getByBarCode(barcode: String) : Observable<ProductResponse>{

        let response = this.http
            .get(this.UrlService + `/product/get-by-barcode?barcode=${barcode}`, this.getHeaderAuthJson(this.token))
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }

    post(request: ProductResponse) : Observable<ProductResponse>{

        let response = this.http
            .post(this.UrlService + '/product/add', request, this.getHeaderAuthJson(this.token))
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }

    put(request: ProductResponse) : Observable<ProductResponse>{

        let response = this.http
            .put(this.UrlService + '/product/update', request, this.getHeaderAuthJson(this.token))
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }

    delete(request: ProductResponse) : Observable<ProductResponse>{

        let response = this.http
        .delete(this.UrlService + `/product/delete?id=${request.id}`, this.getHeaderAuthJson(this.token))
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }

}