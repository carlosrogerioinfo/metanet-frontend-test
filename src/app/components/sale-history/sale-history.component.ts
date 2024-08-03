import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SaleResponse } from 'src/app/models/sale';
import { SaleService } from 'src/app/services/sale.service';
import { HelperUtils } from 'src/app/utils/helper';
import { LocalStorageUtils } from 'src/app/utils/localstorage';

@Component({
    templateUrl: './sale-history.component.html',
    providers: [MessageService]
})
export class SaleHistoryComponent implements OnInit {

    errors: any[] = [];
    requiredFields: boolean = false;

    //-----VENDAS
    sales: SaleResponse[] = [];
    sale: SaleResponse = {};
    selectedSales: SaleResponse[] = [];

    //MODAL
    saleDialog: boolean = false;
    deleteSaleDialog: boolean = false;
    deleteSalesDialog: boolean = false;

    //FORMS
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private saleService: SaleService,
        private messageService: MessageService,
        private helper: HelperUtils,
        private storage: LocalStorageUtils)
    {

    }

    ngOnInit() {
        this.initializeSale();
    }

    initializeSale(){
        this.saleService.get()
        .subscribe(
            success => {
                this.onSuccess(success)
            },
            fail => {this.onFail(fail)}
        );
    }

    onSuccess(response: any){
        this.errors = [];
        this.sales = response;
    }



    // MODALS OPERATIONS

    onHideDialog() {
        this.saleDialog = false;
        this.submitted = false;
    }

    onOpenNew() {
        this.sale = {};
        this.submitted = false;
        this.saleDialog = true;
    }

    onEditSale(sale: SaleResponse) {

        this.sale = { ...sale };
        this.saleDialog = true;
    }

    onDeleteSale(sale: SaleResponse) {
        this.deleteSaleDialog = true;
        this.sale = { ...sale };
    }

    onDeleteSelectedSales() {
        this.deleteSalesDialog = true;
    }

    onFail(fail: any){
        this.errors = fail.error.errors;
        this.errors.forEach((error, index) => {
            this.helper.showNotification('Warning', error.message);
        });

        this.helper.verifyErrorRedirection(fail.error.errors);
    }

    //COMPONENTE TABLE E MANIPULAÇÃO FRONTEND JSON

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.sales.length; i++) {
            if (this.sales[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onConfirmRequiredFields() {
        this.requiredFields = false;
    }
}
