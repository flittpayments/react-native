import {StyleProp, ViewStyle} from "react-native";
import {ThemeType} from "../GooglePayButton/types";
import {IOrder, IReceipt} from "../../manager/types";

export type ApplePayButtonType =
    | 'plain'
    | 'buy'
    | 'setup'
    | 'inStore'
    | 'donate'
    | 'checkout'
    | 'book'
    | 'subscribe';

export type ApplePayButtonStyle = 'white' | 'whiteOutline' | 'black';
export interface INativeApplePayButton {
    onPress?: () => void;
    type?: ApplePayButtonType;
    buttonStyle?: ApplePayButtonStyle;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

interface IApplePayButtonBase {
    theme?: ThemeType;
    type?: ApplePayButtonType;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
    onSuccess?: (receipt: IReceipt) => void;
    onError?: (error: any) => void;
    onStart?: () => void,
    onProcess?: (receipt:IReceipt) => void,
    disabled?:boolean,
    buttonStyle:ApplePayButtonStyle,
}

interface IApplePayButtonWithOrder extends IApplePayButtonBase {
    order: IOrder;                                 // Order is required in this variation.
    token?: never;                                // Token is not allowed when order is present.
}

interface IApplePayButtonWithToken extends IApplePayButtonBase {
    token: string;                                // Token is required in this variation.
    order?: never;                                // Order is not allowed when token is present.
}


export type IApplePayButton =
    | IApplePayButtonWithOrder
    | IApplePayButtonWithToken;
