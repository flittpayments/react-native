import {StyleProp, ViewStyle} from "react-native";
import {IOrder, IReceipt} from "../../manager/types";

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

interface IGooglePayButtonBase {
    theme?: ThemeType;
    type?: ButtonType;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
    onSuccess?: (receipt: IReceipt) => void;
    onError?: (error: any) => void;
    onStart?: () => void,
    onProcess?: (receipt:IReceipt) => void,
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


export interface IPaymentMethod {
    type: string;
    parameters: {
        allowedAuthMethods: string[];
        allowedCardNetworks: string[];
    };
}

