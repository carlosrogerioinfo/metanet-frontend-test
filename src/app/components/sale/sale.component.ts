import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductResponse } from 'src/app/models/product';
import { SaleRequestAdd, SaleRequestDelete, SaleRequestUpdate, SaleResponse } from 'src/app/models/sale';
import { SaleItemRequest, SaleItemResponse } from 'src/app/models/sale-item';
import { ProductService } from 'src/app/services/product.service';
import { SaleItemService } from 'src/app/services/sale-item.service';
import { SaleService } from 'src/app/services/sale.service';
import { HelperUtils } from 'src/app/utils/helper';
import { LocalStorageUtils } from 'src/app/utils/localstorage';

@Component({
    templateUrl: './sale.component.html',
    providers: [MessageService],
    styles: [`
        .align-right .ui-inputfield {
            text-align: right;
        }
    `]
})
export class SaleComponent implements OnInit {

    @ViewChild('inputBarCode') inputBarCodeRef: ElementRef;

    errors: any[] = [];
    requiredFields: boolean = false;

    //-----VENDAS
    sales: SaleResponse[] = [];
    sale: SaleResponse = {};
    product: ProductResponse = {};
    saleIdentifier: string;

    selectedSaleItens: SaleItemResponse[] = [];
    saleItens: SaleItemResponse[] = [];
    saleItem: SaleItemResponse = {};
    saleQuantity: number = 0;
    totalItens: number = 0;
    barCode: String = '';

    saleRequestAdd: SaleRequestAdd = {};

    //MODAL
    saleDialog: boolean = false;
    deleteSaleDialog: boolean = false;
    deleteSalesDialog: boolean = false;

    deleteProductDialog: boolean = false;
    productDialog: boolean = false;

    //FORMS
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private salesService: SaleService,
        private salesItemService: SaleItemService,
        private productService: ProductService,
        private messageService: MessageService,
        private helper: HelperUtils,
        private storage: LocalStorageUtils)
    {

    }

    ngOnInit() {
        this.initializeSale();
    }

    ngOnDestroy() {
        if (this.sale.saleStatus == "Aberta"){

            this.salesService.deleteOpened()
            .subscribe(
                success => {
                    this.errors = [];
                    this.sale = {};
                },
                fail => {this.onFail(fail)}
            );
        }
    }

    initializeSale(){

        const user = this.storage.getUserFromStorage();
        const saleRequest: SaleRequestAdd = {
            userId: user.id
        };

        this.salesService.post(saleRequest)
        .subscribe(
            success => {this.onSuccessSale(success)},
            fail => {this.onFail(fail)}
        );
    }

    onSuccessSale(response: any){
        this.errors = [];
        this.saleIdentifier = "IDENTIFICADOR DA VENDA: "
            + response.id.toUpperCase()
            + " - DATA: "
            + new Date(response.saleDate).toLocaleDateString('pt-BR')
            + " " + new Date(response.saleDate).toLocaleTimeString('pt-BR');

        this.sale = response;
    }

    onCloseSale() {

        this.putSale();
        this.sale = {};
    }

    putSale(){

        const request: SaleRequestUpdate = {
            id: this.sale.id,
            paymentFormat: 1
        };


        this.salesService.put(request)
        .subscribe(
            success => {
                this.errors = [];
                this.sale = {};
                this.saleItens = [];
                this.totalItens = 0;
                this.initializeSale();
            },
            fail => {this.onFail(fail)}
        );
    }

    onKeyDownFindProduct(event: KeyboardEvent) {
        if (event.key === 'Enter') {

            const input = event.target as HTMLInputElement;
            this.barCode = input.value;
            this.productService.getByBarCode(input.value)
            .subscribe(
                success => {
                    this.errors = [];
                    this.product = success;

                    //depois de localizado adiciona o item

                    const request: SaleItemRequest = {
                        saleId: this.sale.id,
                        productId: this.product.id,
                        quantity: 1,
                        price: this.product.price
                    };

                    this.salesItemService.post(request)
                    .subscribe(
                        success => {
                            this.errors = [];
                            this.saleItem = success;
                            this.product = {};
                            this.barCode = '';
                            //Após salvar o item, carrega todos os itens da venda
                            this.salesItemService.get(this.sale.id)
                            .subscribe(
                                success => {this.onSuccessSaleItem(success)},
                                fail => {this.onFail(fail)}
                            );

                        },
                        fail => {

                            this.onFail(fail)
                        }
                    );

                },
                fail => {
                    this.barCode = '';
                    this.onFail(fail)
                }
            );

            (event.target as HTMLInputElement).value = '';

        }
      }

      onKeyDownSaleSave(event: KeyboardEvent, nextInput: ElementRef) {
        if (event.key === 'Enter') {

            const input = event.target as HTMLInputElement;

            const request: SaleItemRequest = {
                saleId: this.sale.id,
                productId: this.product.id,
                quantity: Number(input.value),
                price: this.product.price
            };

            this.salesItemService.post(request)
            .subscribe(
                success => {
                    this.errors = [];
                    this.saleItem = success;
                    this.product = {};

                    //Após salvar o item, carrega todos os itens da venda
                    this.salesItemService.get(this.sale.id)
                    .subscribe(
                        success => {this.onSuccessSaleItem(success)},
                        fail => {this.onFail(fail)}
                    );

                },
                fail => {this.onFail(fail)}
            );

            (event.target as HTMLInputElement).value = '';
            this.barCode = '';
            nextInput.nativeElement.focus();
        }
      }

      onSuccessSaleItem(response: any){
        this.errors = [];
        this.saleItens = response;

        const totalSum = this.saleItens.reduce((sum, item) => sum + item.total, 0);
        this.totalItens = totalSum;
    }

    // MODALS OPERATIONS

    onDeleteProduct(product: ProductResponse) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    onHideDialog() {
        this.saleDialog = false;
        this.submitted = false;
    }

    //CANCELA A VENDA INICIALIZADA
    onDeleteSelectedSales(id: any) {
        const request: SaleRequestDelete = {
            id: id
        };

        this.salesService.delete(request)
        .subscribe(
            success => {
                this.errors = [];
                this.sale = {};
                this.messageService.add({ severity: 'success', summary: 'Venda', detail: 'Venda cancelada com sucesso', life: 3000 });
                this.initializeSale();
            },
            fail => {this.onFail(fail)}
        );

        this.deleteSalesDialog = true;
    }

    onConfirmDelete() {

        this.deleteSaleDialog = false;
        this.sale = {};
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

    onValidate(request: SaleRequestAdd): boolean{

        if (!request.userId)
        {
            this.requiredFields = true;
            return false;
        }

        return true;
    }

}
