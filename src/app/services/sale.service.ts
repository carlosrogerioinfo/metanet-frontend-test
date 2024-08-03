import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BaseService } from "src/app/services/base.service";
import { SaleRequestAdd, SaleRequestDelete, SaleRequestUpdate, SaleResponse } from "../models/sale";
import { LocalStorageUtils } from "../utils/localstorage";

@Injectable()
export class SaleService extends BaseService {

    constructor(private http: HttpClient, private storage: LocalStorageUtils) { super(); }

    private token = this.storage.getTokenFromStorage();

    get() : Observable<SaleResponse>{

        let response = this.http
            .get(this.UrlService + '/sale/get-all', this.getHeaderAuthJson(this.token))
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }

    post(request: SaleRequestAdd) : Observable<SaleResponse>{

        let response = this.http
            .post(this.UrlService + '/sale/add', request, this.getHeaderAuthJson(this.token))
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }

    put(request: SaleRequestUpdate) : Observable<SaleResponse>{

        let response = this.http
            .put(this.UrlService + '/sale/update', request, this.getHeaderAuthJson(this.token))
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }

    delete(request: SaleRequestDelete) : Observable<SaleResponse>{

        let response = this.http
        .delete(this.UrlService + `/sale/delete?id=${request.id}`, this.getHeaderAuthJson(this.token))
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }

    deleteOpened() : Observable<SaleResponse>{

        let response = this.http
        .delete(this.UrlService + `/sale/delete-open`, this.getHeaderAuthJson(this.token))
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }

}