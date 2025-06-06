import {IOrder} from "../types";

export interface IApplePay {
    order: IOrder,
    merchantId: number
}

export interface IApplePayToken {
    token: string,
    merchantId: number
}
