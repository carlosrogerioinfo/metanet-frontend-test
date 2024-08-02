import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BaseService } from "src/app/services/base.service";
import { StatisticResponse } from "../models/statistic";
import { LocalStorageUtils } from "../utils/localstorage";

@Injectable()
export class StatisticService extends BaseService {

    constructor(private http: HttpClient, private storage: LocalStorageUtils) { super(); }

    get() : Observable<StatisticResponse>{

        const token = this.storage.getTokenFromStorage();
        let response = this.http
            .get(this.UrlService + '/statistic/get', this.getHeaderAuthJson(token))
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }

}