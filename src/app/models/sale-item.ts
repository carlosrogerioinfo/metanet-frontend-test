import { ProductResponse } from "./product";

export interface SaleItemResponse {
    id?:       string;
    quantity?: number;
    price?:    number;
    total?:    number;
    product?:  ProductResponse;
}

export interface SaleItemRequest {
    quantity?:  number;
    price?:     number;
    productId?: string;
    saleId?:    string;
}
