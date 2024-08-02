import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BaseService } from "src/app/services/base.service";
import { LoginRequest } from "../models/login";
import { UserResponse } from "../models/user";

@Injectable()
export class AuthenticationService extends BaseService {

    constructor(private http: HttpClient) { super(); }

    login(request: LoginRequest) : Observable<UserResponse>{

        let response = this.http
            .post(this.UrlAuthentication + '/authentication/login', request, this.getHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError)
            );

        return response;
    }
}