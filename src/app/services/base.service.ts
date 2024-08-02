import { HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { throwError } from "rxjs";
import { environment } from "src/environments/environment";
import Swal from 'sweetalert2'

export abstract class BaseService {

    protected UrlService: string = environment.apiUrlBase;
    protected UrlAuthentication: string = environment.apiUrlAuth;

    protected getHeaderJson() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    protected getHeaderAuthJson(token: string) {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept'       : 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };
    }

    protected extractData(response: any) {
        return response.data || {};
    }

    protected serviceError(response: Response | any) { //Response pode ser tipo response ou pode ser any
        let customError: string[] = [];

        if (response instanceof HttpErrorResponse) {

            if (response.statusText === "Unknown Error") {

                customError.push("Ocorreu um erro desconhecido");
                response.error.errors = customError;

                Swal.fire({
                    title: 'Ocorreu um erro desconhecido',
                    showClass: {
                      popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                      popup: 'animate__animated animate__fadeOutUp'
                    }
                });
            }
        }

        return throwError(response);
    }
}