import React, { FC, useEffect, useRef, useState, useCallback } from 'react';
import { requireNativeComponent, StyleProp, ViewStyle } from 'react-native';
import { Cloudipsp } from './Cloudipsp';
import { Order, Receipt } from './models';
import {CloudipspWebView} from "./CloudipspWebview";

export type ButtonType =
    | 'book'
    | 'buy'
    | 'checkout'
    | 'donate'
    | 'order'
    | 'pay'
    | 'plain'
    | 'subscribe';

export type ThemeType = 'light' | 'dark';

interface IOrder {
    amount: number;
    currency: string;
    orderId: string;
    description: string;
    email: string;
}

interface IGooglePayButtonBase {
    theme?: ThemeType;
    type?: ButtonType;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
    merchant_id: number;
    webView?: React.RefObject<CloudipspWebView>;
    setWebView?: () => void;
    onSuccess?: (receipt: Receipt) => void;
    onError?: (error: any) => void;
    onStart?:() => void
}

interface IGooglePayButtonWithOrder extends IGooglePayButtonBase {
    order: IOrder;                                 // Order is required in this variation.
    token?: never;                                // Token is not allowed when order is present.
}

interface IGooglePayButtonWithToken extends IGooglePayButtonBase {
    token: string;                                // Token is required in this variation.
    order?: never;                                // Order is not allowed when token is present.
}

export type IGooglePayButton =
    | IGooglePayButtonWithOrder
    | IGooglePayButtonWithToken;


interface IPaymentMethod {
    type: string;
    parameters: {
        allowedAuthMethods: string[];
        allowedCardNetworks: string[];
    };
}

interface IGooglePayNativeComponent {
    onPress: () => void;                         // Function to call onPress.
    theme?: ThemeType;                           // Optional theme for the button, default is 'light'.
    type?: ButtonType;                           // Optional type of button, default is 'buy'.
    borderRadius?: number;                       // Optional border radius for styling the button.
    style?: StyleProp<ViewStyle>;                // Optional custom style to apply to the button.
    allowedPaymentMethods?:IPaymentMethod[],
}

const RNGooglePayButton = requireNativeComponent<IGooglePayNativeComponent>('GooglePayButton');

export const GooglePayButton: FC<IGooglePayButton> = ({
                                                          theme = 'light',
                                                          type = 'buy',
                                                          borderRadius,
                                                          style,
                                                          order,
                                                          merchant_id,
                                                          webView,
                                                          setWebView,
                                                          onSuccess,
                                                          onError,
                                                          token = '',
                                                          onStart
                                                      }) => {
    const [supportsGPay, setSupportsGPay] = useState(false)
    const [config, setConfig] = useState<any>(null)
    const cloudipsp = useRef<Cloudipsp | null>(null)
    const isProcessing = useRef(false)

    const initializeCloudipsp = useCallback(() => {
        cloudipsp.current = new Cloudipsp(merchant_id, (payConfirmator) => {
            if (setWebView){
                setWebView();
            }
            return payConfirmator(webView?.current!)
        });
    }, [merchant_id, webView, setWebView])

    const initiatePaymentButton = useCallback(async () => {
        if (cloudipsp.current) {
            try {
                const response = await cloudipsp.current?.initiateGooglePayButton(
                    token,
                    order?.amount,
                    order?.currency
                );
                setConfig(response)
            } catch (error) {
                if(onError){
                    onError(error)
                }
            }
        }
    }, [order, token, onError])

    const createPayment = useCallback(async () => {
        if (isProcessing.current) return // Prevent multiple executions
        isProcessing.current = true;
        try {
            if(onStart){
                onStart()
            }
            if (order) {
                const _order = new Order(
                    order.amount,
                    order.currency,
                    order.orderId,
                    order.email,
                    order.description
                );
                const receipt = await cloudipsp.current?.googlePay(_order, config)
                if(onSuccess){
                    onSuccess(receipt as Receipt)
                }
            } else if (token) {
                const receipt = await cloudipsp.current?.googlePayToken(token, config)
                if(onSuccess){
                    onSuccess(receipt as Receipt)
                }
            }
        } catch (error) {
            if(onError){
                onError(error)
            }
        } finally {
            isProcessing.current = false; // Reset the processing state
        }
    }, [order, token, config, onSuccess, onError])

    const checkGPaySupport = useCallback(async () => {
        try {
            const supported = await Cloudipsp.supportsGooglePay()
            setSupportsGPay(supported)
        } catch (error) {
            if(onError){
                onError(error)
            }
        }
    }, [onError])

    useEffect(() => {
        checkGPaySupport()
        initializeCloudipsp()
    }, [checkGPaySupport, initializeCloudipsp])

    useEffect(() => {
        if (supportsGPay) {
            initiatePaymentButton()
        }
    }, [supportsGPay, initiatePaymentButton])

    return supportsGPay ? (
        <RNGooglePayButton
            style={style}
            onPress={createPayment}
            theme={theme}
            type={type}
            borderRadius={borderRadius}
            allowedPaymentMethods={config?.allowedPaymentMethods}
        />
    ) : null;
};
