import {Platform} from "react-native";
import {BaseURL} from "../helpers/constants";
import {ICheckout, IOrder, IReceipt, TPrivateOrder, TMobileRequest, IGetTokenResponse} from "./types";
import {getOrderObject} from "./common";
import {IInfo} from "./bank/types";

interface AjaxOptions<R> {
    path: string
    request: R
}

async function ajax<T, R>({path, request}: AjaxOptions<R>): Promise<T> {
    const url = `${BaseURL}${path}`
    if (__DEV__) {
        console.log(`Request → ${url}`, request)
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'React-Native',
                'SDK-OS': Platform.OS,
                'SDK-Version': '1.0.0',
            },
            body: JSON.stringify({request}),
        })
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`)
        }
        const json = await response.json()
        if (__DEV__) {
            console.log(`Response ← ${url}`, json)
        }
        return json.response
    } catch (error) {
        console.error(`Error fetching ${url}:`, error)
        throw error
    }
}

export const ApiManager = {
    checkout: <T>(checkout:Partial<ICheckout>):Promise<T> => {
        return ajax<T, Partial<ICheckout>>({path: '/api/checkout/ajax', request: checkout})
    },
    getToken: (merchantId:number,order: IOrder) => {
        const reqObject = getOrderObject({merchantId,order})
        return ajax<IGetTokenResponse, Partial<TPrivateOrder>>({path: '/api/checkout/token', request: reqObject})
    },
    getOrder:(token:string) => {
        return ajax<IReceipt, Record<string, string>>({path: '/api/checkout/merchant/order', request: { token }})
    },
    getInfo:async({merchantId,token,order}:{merchantId:number,token?:string,order?:IOrder}) => {
        try{
            if (!order && !token) {
                throw new Error('order or token should be provided');
            }
            let requestToken:string
            if(order){
                const response = await ApiManager.getToken(merchantId, order)
                requestToken = response.token
            }else{
                requestToken = token!
            }
            return ajax<IInfo, Record<string, string>>({path: '/api/checkout/ajax/info', request: { token: requestToken }})
        }catch (e){
            console.log(e)
        }
    },
    checkoutMobilePay:({ ...request }:TMobileRequest) => {
        return ajax<any,TMobileRequest>({path:'/api/checkout/ajax/mobile_pay',request})
    },
}
