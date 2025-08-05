import React, {FC, useCallback, useEffect} from 'react';
import {requireNativeComponent} from 'react-native';
import {useFlitt} from "../../Flitt";
import {IApplePayButton, INativeApplePayButton} from "./types";


const RNApplePayButton = requireNativeComponent<INativeApplePayButton>('ApplePayButton');

export const ApplePayButton: FC<IApplePayButton> = ({
                                                        type = 'plain',
                                                        buttonStyle = 'black',
                                                        style,
                                                        disabled = false,
                                                        onStart,
                                                        onSuccess,
                                                        onError,
                                                        onProcess,
                                                        order,
                                                        token = ''
                                                    }) => {
    const {supportsApplePay, checkApplePaySupport, createPayment,isProcessing} = useFlitt()


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
    }, [order, token, onSuccess, onError,onProcess])


    useEffect(() => {
        checkApplePaySupport().catch((error) => {
            onError?.(error)
        })
    }, [])

    return (
        supportsApplePay ? (
            <RNApplePayButton
                style={[
                    {
                        height: 44,
                        width: '100%',
                    },
                    style
                ]}
                disabled = {disabled}
                onPress={handleCreatePayment}
                buttonStyle={buttonStyle}
                type={type}
            />
        ) : null
    );
};
