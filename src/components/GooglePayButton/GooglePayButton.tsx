import React, {FC, useEffect, useCallback} from 'react';
import {requireNativeComponent, StyleProp, ViewStyle} from 'react-native';
import {useFlitt} from "../Flitt";
import {ButtonType, IGooglePayButton, IPaymentMethod, ThemeType} from "./types";


interface IGooglePayNativeComponent {
    onPress: () => void;                         // Function to call onPress.
    theme?: ThemeType;                           // Optional theme for the button, default is 'light'.
    type?: ButtonType;                           // Optional type of button, default is 'buy'.
    borderRadius?: number;                       // Optional border radius for styling the button.
    style?: StyleProp<ViewStyle>;                // Optional custom style to apply to the button.
    allowedPaymentMethods?: IPaymentMethod[],
}

const RNGooglePayButton = requireNativeComponent<IGooglePayNativeComponent>('GooglePayButton');

export const GooglePayButton: FC<IGooglePayButton> = ({
                                                          theme = 'light',
                                                          type = 'buy',
                                                          borderRadius,
                                                          style,
                                                          order,
                                                          onSuccess,
                                                          onError,
                                                          token = '',
                                                          onStart,
                                                          onProcess
                                                      }) => {

    const {createPayment, initiatePaymentButton, checkGPaySupport, supportsGPay, config, isProcessing} = useFlitt()


    const handleCreatePayment = useCallback(async () => {
        if (isProcessing.current) return
        try {
            if (onStart) {
                onStart()
            }
            createPayment({
                token,
                order,
                onSuccess,
                onError,
                onProcess,
                onStart
            })
        } catch (error) {
            if (onError) {
                onError(error)
            }
        }
    }, [order, token, config, onSuccess, onError,onProcess])


    useEffect(() => {
        checkGPaySupport().catch((error) => {
            onError?.(error)
        })
    }, [checkGPaySupport])

    useEffect(() => {
        if (supportsGPay) {
            initiatePaymentButton(token, order).catch((error) => {
                onError?.(error)
            })
        }
    }, [supportsGPay, initiatePaymentButton])


    return supportsGPay ? (
        <RNGooglePayButton
            style={style}
            onPress={handleCreatePayment}
            theme={theme}
            type={type}
            borderRadius={borderRadius}
            allowedPaymentMethods={config?.data?.allowedPaymentMethods}
        />
    ) : null;
};
