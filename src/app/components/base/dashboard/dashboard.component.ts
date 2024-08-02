import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ProductResponse } from 'src/app/models/product';
import { SaleResponse } from 'src/app/models/sale';
import { UserResponse } from 'src/app/models/user';
import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';
import { UserServicea } from 'src/app/services/user.service';
import { HelperUtils } from 'src/app/utils/helper';
import { LocalStorageUtils } from 'src/app/utils/localstorage';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

    errors: any[] = [];
    products: ProductResponse[] = [];
    sales: SaleResponse[] = [];
    users: UserResponse[] = [];

    constructor(
        public layoutService: LayoutService,
        private productsService: ProductService,
        private userService: UserServicea,
        private saleService: SaleService,
        private storage: LocalStorageUtils,
        private helper: HelperUtils)
    {

    }

    ngOnInit() {
        this.initialize();
    }

    initialize(){
        this.productsService.get()
        .subscribe(
            success => {this.onSuccessProduct(success)},
            fail => {this.onFail(fail)}
        );

        this.saleService.get()
        .subscribe(
            success => {this.onSuccessSale(success)},
            fail => {this.onFail(fail)}
        );

        this.userService.get()
        .subscribe(
            success => {this.onSuccessUserInfo(success)},
            fail => {this.onFail(fail)}
        );

        this.userService.getAll()
        .subscribe(
            success => {this.onSuccessUser(success)},
            fail => {this.onFail(fail)}
        );
    }

    onSuccessProduct(response: any){
        this.errors = [];
        this.products = response;
    }

    onSuccessSale(response: any){
        this.errors = [];
        this.sales = response;
    }

    onSuccessUser(response: any){
        this.errors = [];
        this.users = response;
    }

    onFail(fail: any){
        this.errors = fail.error.errors;
        this.errors.forEach((error, index) => {
            this.helper.showNotification('Warning', error.message);
        });

        this.helper.verifyErrorRedirection(fail.error.errors);
    }

    onSuccessUserInfo(response: any){
        this.errors = [];
        this.storage.saveUserInfoDataLocalStorage(response);

    }


}
