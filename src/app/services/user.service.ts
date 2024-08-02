import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BaseService } from "src/app/services/base.service";
import { UserRequest, UserResponse } from "../models/user";
import { LocalStorageUtils } from "../utils/localstorage";

@Injectable()
export class UserService extends BaseService {

    constructor(private http: HttpClient, private storage: LocalStorageUtils) { super(); }

    private token = this.storage.getTokenFromStorage();

    get() : Observable<UserResponse>{

        let response = this.http
            .get(this.UrlService + '/user/get', this.getHeaderAuthJson(this.token))
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }

    getAll() : Observable<UserResponse>{
        let response = this.http
            .get(this.UrlService + '/user/get-all', this.getHeaderAuthJson(this.token))
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }

}