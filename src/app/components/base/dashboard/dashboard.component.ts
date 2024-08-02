import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { StatisticResponse } from 'src/app/models/statistic';
import { StatisticService } from 'src/app/services/statistic.service';
import { UserService } from 'src/app/services/user.service';
import { HelperUtils } from 'src/app/utils/helper';
import { LocalStorageUtils } from 'src/app/utils/localstorage';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

    errors: any[] = [];

    statistic: StatisticResponse = {};

    constructor(
        public layoutService: LayoutService,
        private statisticService: StatisticService,
        private userService: UserService,
        private storage: LocalStorageUtils,
        private helper: HelperUtils)
    {

    }

    ngOnInit() {
        this.initialize();
    }

    initialize(){

        this.userService.get()
        .subscribe(
            success => {this.onSuccessUserInfo(success)},
            fail => {this.onFail(fail)}
        );

        this.statisticService.get()
        .subscribe(
            success => {this.onSuccessStatistic(success)},
            fail => {this.onFail(fail)}
        );

    }

    onSuccessUserInfo(response: any){
        this.errors = [];
        this.storage.saveUserInfoDataLocalStorage(response);

    }

    onSuccessStatistic(response: any){
        this.errors = [];
        this.statistic = response;
    }

    onFail(fail: any){
        this.errors = fail.error.errors;
        this.errors.forEach((error, index) => {
            this.helper.showNotification('Warning', error.message);
        });

        this.helper.verifyErrorRedirection(fail.error.errors);
    }

}
