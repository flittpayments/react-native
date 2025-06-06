import {IOrder} from "../types";

export interface IGooglePayToken {
    token: string,
    merchantId:number,
    config?: any
}

export interface IGooglePay {
    order: IOrder,
    merchantId:number,
    config?: any
}

export interface IProcessGooglePayToken{
    token: string,
    config: any
}
