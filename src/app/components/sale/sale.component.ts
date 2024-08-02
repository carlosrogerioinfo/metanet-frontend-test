import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductResponse } from 'src/app/models/product';
import { SaleRequestAdd, SaleRequestDelete, SaleResponse } from 'src/app/models/sale';
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

    errors: any[] = [];
    requiredFields: boolean = false;

    //-----VENDAS
    sales: SaleResponse[] = [];
    sale: SaleResponse = {};
    product: ProductResponse = {};
    saleIdentifier: string;

    selectedSaleItens: SaleItemResponse[] = []; //Para exclusão em lote
    saleItens: SaleItemResponse[] = [];
    saleItem: SaleItemResponse = {};
    saleQuantity: number = 0;

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

        if (this.sale.saleStatus == "Open"){
            const request: SaleRequestDelete = {
                id: this.sale.id
            };

            this.salesService.delete(request)
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
            + new Date(response.saleDate).toLocaleTimeString('pt-BR');

        this.sale = response;
    }

    postSale(request: SaleRequestAdd){
        this.salesService.post(request)
            .subscribe(
            success => {
                this.errors = [];
                this.sale = success;
            },
            fail => {this.onFail(fail)}
        );
    }

    putSale(request: SaleResponse){
        this.salesService.put(request)
        .subscribe(
            success => {
                this.errors = [];
                this.sale = success;
                this.messageService.add({ severity: 'success', summary: 'Alteração', detail: 'Produto alterado', life: 3000 });
                this.initializeSale();
            },
            fail => {this.onFail(fail)}
        );
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {

            const input = event.target as HTMLInputElement;

            this.productService.getByBarCode(input.value)
            .subscribe(
                success => {
                    this.errors = [];
                    this.product = success;
                },
                fail => {this.onFail(fail)}
            );

            //   // Limpa o input (opcional)
            //   (event.target as HTMLInputElement).value = '';
        }
      }

      onKeyDownSaleSave(event: KeyboardEvent) {
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
                },
                fail => {this.onFail(fail)}
            );

            this.salesItemService.get(this.sale.id)
            .subscribe(
                success => {this.onSuccessSaleItem(success)},
                fail => {this.onFail(fail)}
            );
        }
      }

      onSuccessSaleItem(response: any){
        this.errors = [];
        this.saleItens = response;
    }

    // MODALS OPERATIONS

    onEditProduct(product: ProductResponse) {

        this.product = { ...product };
        this.productDialog = true;
    }

    onDeleteProduct(product: ProductResponse) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }




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

        //this.deleteSale(this.sale);
        this.deleteSaleDialog = false;
        this.sale = {};
    }

    // onConfirmDeleteSelected() {
    //     this.deleteSalesDialog = false;

    //     this.selectedSales.forEach(element => {
    //         this.deleteBatchSale(element);
    //     });

    //     this.selectedSales = [];
    // }

    onSaveSale() {
        this.submitted = this.onValidate(this.saleRequestAdd);//true;

        if (this.submitted){

            if (this.saleRequestAdd.userId?.trim()) {
                this.postSale(this.saleRequestAdd);
                // if (this.sale.id) {
                //     this.sales[this.findIndexById(this.sale.id)] = this.sale;

                //     this.putSale(this.sale);
                // } else {
                //     this.postSale(this.sale);

                this.saleDialog = false;
                this.sale = {};
            }
        }
        else
        {
            this.requiredFields = true;
        }
    }

    onFail(fail: any){
        this.errors = fail.error.errors;
        this.errors.forEach((error, index) => {
            this.helper.showNotification('Warning', error.message);
        });

        this.helper.verifyErrorRedirection(fail.error.errors);
    }

    onFailBatch(fail: any){
        this.errors = fail.error.errors;
        this.errors.forEach((error, index) => {
            this.helper.showNotification('Warning', 'Alguns ou todos os itens selecionados para exclusão podem estar sendo usados');
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

    onConfirmRequiredFields() {
        this.requiredFields = false;
    }
}
