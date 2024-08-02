import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Injectable()
export class LocalStorageUtils {

    constructor(private router: Router) {}

    public adminUser = 'c3a6bb81-7a67-49bd-acf4-1793291a7f64';

    public getUserFromStorage() {
        return JSON.parse(localStorage.getItem('storageinfo.user'));
    }

    public getTokenFromStorage(): string {
        return localStorage.getItem('storageinfo.token');
    }

    public saveAllUserDataLocalStorage(response: any) {
        this.saveUserToken(response.token);
        this.saveUser(response);
    }

    public saveUserTokenDataLocalStorage(response: any) {
        this.saveUserToken(response.token);
    }

    public saveUserInfoDataLocalStorage(response: any) {
        this.saveUser(response);
    }

    public clearAllUserDataLocalStorage() {
        localStorage.removeItem('storageinfo.token');
        localStorage.removeItem('storageinfo.user');

        this.router.navigate(['/login']);
    }

    public saveUserToken(token: string) {
        localStorage.setItem('storageinfo.token', token);
    }

    public saveUser(user: string) {
        localStorage.setItem('storageinfo.user', JSON.stringify(user));
    }

    public isAuthenticated(showAlert: boolean = false): boolean {

        if (showAlert){
            Swal.fire({
                title: 'Usuário não autenticado',
                text: 'É necessário relizar login no sistema!',
                showClass: {
                popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
                }
            });
        }
        const token = this.getTokenFromStorage();
        return (token == undefined ? false : true);
    }

    public saveCookie(param: string, value: string)
    {
        localStorage.setItem(param, value);
    }

    public readCookie(param: string): string
    {
        return localStorage.getItem(param);
    }

}