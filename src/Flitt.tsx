import React, {createContext, useCallback, useContext, useRef, useState} from 'react';
import {Platform} from "react-native";
import {
    FlittProps, IBankPayment, ICreateCardPayment,
    ICreatePayment,
    IFlittContext, IGetAvailableBanks,
    IThrowCallback,
    STATUSES
} from "./types";
import {getPaymentConfig, supportsApplePay, supportsGooglePay} from "./manager/common";
import {googlePay, googlePayToken} from "./manager/googlePay";
import {applePay, applePayToken} from "./manager/applePay";
import {getAvailableBankList, initializeBankPayment} from "./manager/bank";
import {IOrder, IReceipt} from "./manager/types";
import {IBank} from "./manager/bank/types";
import {parseExpiry} from "./helpers/parseExpiry";
import {pay, payToken} from "./manager/card";

// Context setup
const FlittContext = createContext<IFlittContext | undefined>(undefined);

// Provider component
export const Flitt: React.FC<FlittProps> = ({merchantId, children}) => {
        const [supportsGPay, setSupportsGPay] = useState<boolean>(false);
        const [supportsAPay, setSupportsApplePay] = useState(false)
        const [config, setConfig] = useState<any>(null);
        const [isWebViewVisible, setWebViewVisible] = useState<boolean>(false);
        const isProcessing = useRef<boolean>(false);


        const initiatePaymentButton = useCallback(async (token?: string, order?: IOrder): Promise<Error | void> => {
            try {
                const response = await getPaymentConfig({
                    token,
                    amount: order?.amount ? +order.amount : 0,
                    currency: order?.currency,
                    methodId: 'https://google.com/pay',
                    methodName: 'GooglePay',
                    merchantId
                });
                setConfig(response);
            } catch (error) {
                return error as Error;
            }
        }, []);

        const checkGPaySupport = useCallback(async (): Promise<Error | boolean> => {
            try {
                const supported = await supportsGooglePay()
                setSupportsGPay(supported);
                return supported;
            } catch (error) {
                return error as Error;
            }
        }, []);
        const checkApplePaySupport = useCallback(async (): Promise<Error | boolean> => {
            try {
                const supported = await supportsApplePay();
                setSupportsApplePay(supported);
                return supported;
            } catch (error) {
                return error as Error;
            }
        }, []);

        const throwCallback = ({status, responseCode, onSuccess, receipt, onProcess, onError}: IThrowCallback) => {
            if (status === STATUSES.APPROVED.toLowerCase()) {
                onSuccess?.(receipt)
            } else if (status !== STATUSES.APPROVED.toLowerCase() && responseCode === "") {
                onProcess?.(receipt)
            } else {
                onError?.(receipt)
            }
        }

        const createPayment = useCallback(async ({
                                                     token,
                                                     order,
                                                     onError,
                                                     onProcess,
                                                     onSuccess,
                                                     onStart
                                                 }: ICreatePayment) => {
            isProcessing.current = true;
            onStart?.()
            try {
                if (!order && !token) {
                    onError?.(new Error('order or token must exist'))
                }
                let receipt: IReceipt | undefined;
                if (order) {
                    if (Platform.OS === 'android') {
                        receipt = await googlePay({order, merchantId, config});
                    } else if (Platform.OS === 'ios') {
                        receipt = await applePay({order, merchantId})
                    }
                    if (receipt) {
                        throwCallback({
                            status: receipt.order_data.order_status,
                            // status: receipt.response_status,
                            responseCode: receipt.order_data.response_code,
                            onSuccess,
                            receipt,
                            onProcess,
                            onError
                        })
                        return
                    }
                    onError?.(new Error('something went wrong, receipt not provided'))
                } else if (token) {
                    if (Platform.OS === 'android') {
                        receipt = await googlePayToken({token, merchantId, config});
                    } else if (Platform.OS === 'ios') {
                        receipt = await applePayToken({token, merchantId});
                    }
                    if (receipt) {
                        throwCallback({
                            status: receipt.order_data.order_status,
                            responseCode: receipt.order_data.response_code,
                            onSuccess,
                            receipt,
                            onProcess,
                            onError
                        })
                        return
                    }
                    onError?.(new Error('something went wrong, receipt not provided'))
                }
            } catch (error) {
                onError?.(error as Error)
            } finally {
                isProcessing.current = false;
            }
        }, [config]);


        const getAvailableBanks = async ({token, order}: IGetAvailableBanks): Promise<IBank[]> => {
            try {
                return await getAvailableBankList({merchantId, token, order});
            } catch (e) {
                throw e
            }
        };

        const initiateBankPayment = async ({
                                               order,
                                               token,
                                               autoRedirect,
                                               bankId,
                                               onSuccess,
                                               onStart,
                                               onError
                                           }: IBankPayment) => {
            isProcessing.current = true;
            onStart?.()
            try {
                const response = await initializeBankPayment({
                    merchantId,
                    order,
                    token,
                    autoRedirect,
                    bankId
                })
                if (response) {
                    onSuccess?.(response)
                }
            } catch (error) {
                onError?.(error as Error)
            } finally {
                isProcessing.current = false
            }
        }


        const createCardPayment = useCallback(async ({
                                                         token,
                                                         order,
                                                         onError,
                                                         onProcess,
                                                         onSuccess,
                                                         onStart,
                                                         data
                                                     }
                                                     : ICreateCardPayment) => {
                isProcessing.current = true;
                onStart?.()
                try {
                    if (!order && !token) {
                        onError?.(new Error('order or token must exist'))
                    }
                    const {cardNumber, expiry, cvv} = data
                    const {month, year} = parseExpiry(expiry)

                    let receipt: IReceipt | undefined;

                    const requestObject = {
                        cardNumber: cardNumber.replace(/\s/g, ''),
                        mm: parseInt(month, 10),
                        yy: parseInt(year, 10),
                        cvv,
                        merchantId,
                        email: order?.email || ''
                    }

                    if (!token) {
                        receipt = await pay({
                            ...requestObject,
                            order: order!,
                        })
                        if (receipt) {
                            throwCallback({
                                status: receipt?.order_data.order_status,
                                responseCode: receipt.order_data.response_code,
                                onSuccess,
                                receipt,
                                onProcess,
                                onError
                            })
                        }
                        return
                    }
                    receipt = await payToken({
                        ...requestObject,
                        token
                    })
                    if (receipt) {
                        throwCallback({
                            status: receipt?.order_data.order_status,
                            responseCode: receipt.order_data.response_code,
                            onSuccess,
                            receipt,
                            onProcess,
                            onError
                        })
                    }
                } catch (error) {
                    onError?.(error as Error)
                } finally {
                    isProcessing.current = false
                }
            }
            ,
            []
        )


        const value: IFlittContext = {
            supportsGPay,
            supportsApplePay: supportsAPay,
            config,
            createPayment,
            initiatePaymentButton,
            checkGPaySupport,
            checkApplePaySupport,
            isWebViewVisible,
            setWebViewVisible,
            isProcessing,
            getAvailableBanks,
            initiateBankPayment,
            merchantId,
            createCardPayment
        };

        return (
            <FlittContext.Provider value={value}>
                {children}
            </FlittContext.Provider>
        );
    }
;

const useFlitt = (): IFlittContext => {
    const context = useContext(FlittContext);
    if (context === undefined) {
        throw new Error('useFlitt must be used within a Flitt Provider');
    }
    return context;
};


export {useFlitt};
