import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductResponse, Unity } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { DropdownUtils } from 'src/app/utils/dropdown-utils';
import { HelperUtils } from 'src/app/utils/helper';
import { LocalStorageUtils } from 'src/app/utils/localstorage';

@Component({
    templateUrl: './product.component.html',
    providers: [MessageService]
})
export class ProductComponent implements OnInit {

    errors: any[] = [];
    requiredFields: boolean = false;

    //-----PRODUTOS
    products: ProductResponse[] = []; //Listagem no grid
    product: ProductResponse = {}; //alteração/edição/esclusão
    selectedProducts: ProductResponse[] = []; //Para exclusão em lote

    //MODAL
    productDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;

    // //Dropdown
    // dropDownUnities: Unity[];
    // selectedUnity: Unity;

    //FORMS
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private productsService: ProductService,
        private messageService: MessageService,
        private helper: HelperUtils,
        private storage: LocalStorageUtils)
    {
        //this.dropDownUnities = DropdownUtils.InitializeUnities();
    }

    ngOnInit() {
        this.initializeProduct();
    }

    initializeProduct(){
        this.productsService.get()
        .subscribe(
            success => {
                this.onSuccessProduct(success)
            },
            fail => {this.onFail(fail)}
        );
    }

    onSuccessProduct(response: any){
        this.errors = [];
        this.products = response;
    }

    postProduct(request: ProductResponse){
        this.productsService.post(request)
            .subscribe(
            success => {
                this.errors = [];
                this.product = success;
                this.messageService.add({ severity: 'success', summary: 'Inclusão', detail: 'Produto incluído', life: 3000 });
                this.initializeProduct();
            },
            fail => {this.onFail(fail)}
        );
    }

    putProduct(request: ProductResponse){
        this.productsService.put(request)
        .subscribe(
            success => {
                this.errors = [];
                this.product = success;
                this.messageService.add({ severity: 'success', summary: 'Alteração', detail: 'Produto alterado', life: 3000 });
                this.initializeProduct();
            },
            fail => {this.onFail(fail)}
        );
    }

    deleteProduct(request: ProductResponse){
        this.productsService.delete(request)
        .subscribe(
            success => {
                this.errors = [];
                this.product = success;
                this.messageService.add({ severity: 'success', summary: 'Exclusão', detail: `O produto ${this.product.description} foi removido!`, life: 3000 });

                this.products = this.products.filter(val => val.id !== this.product.id);

                this.initializeProduct();
            },
            fail => {this.onFail(fail);}
        );
    }

    deleteBatchProduct(request: ProductResponse){
        this.productsService.delete(request)
        .subscribe(
            success => {
                this.errors = [];
                this.product = success;
                this.messageService.add({ severity: 'success', summary: 'Exclusão', detail: `O produto ${this.product.description} foi removido!`, life: 3000 });

                this.products = this.products.filter(val => !this.selectedProducts.includes(val));

                this.initializeProduct();
            },
            fail => {this.onFailBatch(fail);}
        );
    }

    // MODALS OPERATIONS

    onHideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    onOpenNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    onEditProduct(product: ProductResponse) {

        this.product = { ...product };
        this.productDialog = true;
    }

    onDeleteProduct(product: ProductResponse) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    onDeleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    onConfirmDelete() {

        this.deleteProduct(this.product);
        this.deleteProductDialog = false;
        this.product = {};
    }

    onConfirmDeleteSelected() {
        this.deleteProductsDialog = false;

        this.selectedProducts.forEach(element => {
            this.deleteBatchProduct(element);
        });

        this.selectedProducts = [];
    }

    onSaveProduct() {
        this.submitted = this.onValidate(this.product);//true;

        if (this.submitted){

            if (this.product.description?.trim()) {
                if (this.product.id) {
                    this.products[this.findIndexById(this.product.id)] = this.product;

                    this.putProduct(this.product);
                } else {
                    this.postProduct(this.product);

                }

                this.productDialog = false;
                this.product = {};
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
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onValidate(request: ProductResponse): boolean{

        if (
            !request.barCode     ||
            !request.description ||
            request.price        <=0
            )
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
