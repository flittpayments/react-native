import React, {RefObject} from "react";
import {IOrder, IReceipt} from "./manager/types";
import {IBank, IBankPaymentResponse, IInitiateBankPayment} from "./manager/bank/types";

export interface IFlittContext {
    supportsGPay: boolean;
    supportsApplePay: boolean;
    config: any;
    createPayment: ({ token, order ,onStart,onProcess,onError,onSuccess } :ICreatePayment) => void;
    initiatePaymentButton: (token?: string, order?: IOrder) => Promise<Error | void>;
    checkGPaySupport: () => Promise<Error | boolean>;
    checkApplePaySupport: () => Promise<Error | boolean>;
    isWebViewVisible:boolean
    // webViewRef:RefObject<any>,
    isProcessing:RefObject<boolean>,
    setWebViewVisible:React.Dispatch<React.SetStateAction<boolean>>,
    getAvailableBanks:({ token,order }: IGetAvailableBanks) => Promise<IBank[]>,
    initiateBankPayment:({ merchantId,order,token,onSuccess,onError,onStart,bankId }:IBankPayment ) => void
    createCardPayment:({ order,token,onSuccess,onError,onStart,data }:ICreateCardPayment ) => void
    merchantId:number
}
export interface FlittProps {
    merchantId: number;
    children: React.ReactNode;
}

export interface ICreatePayment {
    token?:string,
    order?: IOrder,
    onSuccess?:(receipt:IReceipt) => void,
    onError?:(receipt:IReceipt | Error | string) => void,
    onProcess?:(receipt:IReceipt) => void,
    onStart?:() => void,
}

export interface ICreateCardPayment {
    token?:string,
    order?: IOrder,
    onSuccess?:(receipt:IReceipt) => void,
    onError?:(receipt:IReceipt | Error | string) => void,
    onProcess?:(receipt:IReceipt) => void,
    onStart?:() => void,
    data:ICardFormData
}

export interface ICardFormData {
    cardNumber: string
    cvv: string
    expiry:string
}

export enum STATUSES {
    FAILED = 'FAILED'  ,
    IS_PROCESSING = 'IS_PROCESSING',
    APPROVED = 'APPROVED'
}

export interface IThrowCallback {
    status:string,
    responseCode:string,
    receipt:IReceipt,
    onSuccess?:(receipt:IReceipt) => void,
    onError?:(receipt:IReceipt | Error | string) => void,
    onProcess?:(receipt:IReceipt) => void,
}


export interface IGetAvailableBanks {
    token?:string,
    order?:IOrder,
}

export interface IBankPayment extends IInitiateBankPayment {
    onSuccess:(banks:IBankPaymentResponse) => void
    onError:(error:Error) => void
    onStart:() => void
}




