import {Linking} from "react-native";
import {ICheckout, IOrder} from "../types";
import {ApiManager} from "../ApiManager";
import {IBank, IBankPaymentResponse, IInitiateBankPayment} from "./types";
import {getEncodedDeviceFingerprint} from "../../helpers/deviceFingerprint";
import {compareBanks} from "../../helpers/compare";

export const getAvailableBankList = async ({merchantId,token, order}:{merchantId:number,token?:string,order?:IOrder}) => {
    try {
        const response = await ApiManager.getInfo({merchantId,token,order});
        const banks: IBank[] = [];
        if (response?.tabs && response?.tabs.trustly && response.tabs.trustly.payment_systems) {
            const paymentSystems = response.tabs.trustly.payment_systems;
            for (const key in paymentSystems) {
                if (typeof paymentSystems[key] === 'object') {
                    const bankData = paymentSystems[key];
                    const bank = {
                        id:key,
                        country_priority:bankData.country_priority,
                        user_priority:bankData.user_priority,
                        quick_method:bankData.quick_method,
                        user_popular:bankData.user_popular,
                        name:bankData.name,
                        country:bankData.country,
                        bank_logo:bankData.bank_logo,
                        alias:bankData.alias
                    }
                    banks.push(bank);
                }
            }
        }
        banks.sort(compareBanks);
        return banks;
    } catch (error) {
        throw error;
    }
}

export const initializeBankPayment = async ({
                                              merchantId,
                                              order,
                                              token,
                                              bankId,
                                              autoRedirect = true,
                                          }: IInitiateBankPayment): Promise<IBankPaymentResponse> => {

    // Validate required parameters
    if (!bankId) {
        throw new Error('Bank object must be provided');
    }

    if (!token && !order) {
        throw new Error('Either token or order must be provided');
    }

    try {
        const encodedDeviceData = await getEncodedDeviceFingerprint();
        let requestObject = {} as Partial<ICheckout>;
        let responseData: IBankPaymentResponse;
        if (token) {
            // If we have a token, get order details from the API
            const orderInfo = await ApiManager.getOrder(token);
            const { amount,currency } = orderInfo.order_data
            requestObject = {
                merchant_id: merchantId,
                amount: amount,
                currency: currency,
                token: token,
                payment_system: bankId,
                kkh: encodedDeviceData
            };
            responseData = await ApiManager.checkout<IBankPaymentResponse>(requestObject);
        } else if (order) {
            const {token:localToken} = await ApiManager.getToken(merchantId,order);
            requestObject = {
                merchant_id: merchantId,
                amount: order.amount ,
                currency: order.currency,
                token: localToken,
                payment_system: bankId,
                kkh: encodedDeviceData
            };
            responseData = await ApiManager.checkout<IBankPaymentResponse>(requestObject);
        } else {
            throw new Error('Order or token must be provided');
        }
        // Process response
        if (responseData.response_status === "success" &&
            responseData.action === "redirect" &&
            responseData.url) {
            // Handle redirect if needed for React Native
            if (autoRedirect) {
                const canOpen = await Linking.canOpenURL(responseData.url);
                if (canOpen) {
                    await Linking.openURL(responseData.url);
                } else {
                    throw new Error(`Cannot open URL: ${responseData.url}`);
                }
            }
            return responseData
        } else {
            throw new Error(`Payment initiation failed: payment status: ${responseData.response_status}, action: ${responseData.action}`)
        }
    } catch (error) {
        throw error;
    }
}
