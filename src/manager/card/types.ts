import {IOrder} from "../types";

export interface IPayOrder {
    cardNumber: string,
    mm: number,
    yy: number,
    cvv: string,
    order: IOrder,
    merchantId: number,
    email: string
}

export interface IPayToken {
    cardNumber: string,
    mm: number,
    yy: number,
    cvv: string,
    token: string
    merchantId: number,
    email: string
}
