import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BaseService } from "src/app/services/base.service";
import { LocalStorageUtils } from "../utils/localstorage";
import { SaleItemRequest, SaleItemResponse } from "../models/sale-item";

@Injectable()
export class SaleItemService extends BaseService {

    constructor(private http: HttpClient, private storage: LocalStorageUtils) { super(); }

    private token = this.storage.getTokenFromStorage();

    get(saleId: String) : Observable<SaleItemResponse>{

        let response = this.http
            .get(this.UrlService + `/sale-item/get?saleId=${saleId}`, this.getHeaderAuthJson(this.token))
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }

    post(request: SaleItemRequest) : Observable<SaleItemResponse>{

        let response = this.http
            .post(this.UrlService + '/sale-item/add', request, this.getHeaderAuthJson(this.token))
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }

}