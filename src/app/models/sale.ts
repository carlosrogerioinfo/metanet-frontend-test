import { SaleItemResponse } from "./sale-item";

export interface SaleRequestAdd {
    userId?:        string;
}

export interface SaleRequestUpdate {
    id?:                string;
    paymentFormat?: number;
}

export interface SaleRequestDelete {
    id?: string;
}

export interface SaleResponse {
    id?:            string;
    saleDate?:      Date;
    totalValue?:    number;
    paymentFormat?: string;
    saleStatus?:    string;
    saleItems?:     SaleItemResponse[];
}