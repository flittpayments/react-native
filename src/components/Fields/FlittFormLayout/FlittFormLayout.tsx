import React, { ReactNode, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { View, StyleProp, ViewStyle } from 'react-native'
import {FlittFieldBaseHandle} from "../FlittTextInput/FlittTextInput";
import {isCvv4Length, isValidExpireDate} from "../../../helpers/utils/isValidCardNumber";

export interface FlittCardLayoutHandle {
    isValid(): boolean
    getCard(): {
        cardNumber: string
        expMm: string
        expYy: string
        cvv: string
    } | null
    showCard(data: { cardNumber: string; expMm: string; expYy: string; cvv: string }): void
}

type Props = {
    children: ReactNode
    inputNumber: () => FlittFieldBaseHandle
    inputExpMm: () => FlittFieldBaseHandle
    inputExpYy: () => FlittFieldBaseHandle
    inputCvv: () => FlittFieldBaseHandle
    containerStyle?: StyleProp<ViewStyle>
}

export const FlittCardLayout = forwardRef<FlittCardLayoutHandle, Props>(({ children, inputNumber, inputExpMm, inputExpYy, inputCvv, containerStyle }, ref) => {
    const numberRef = useRef<FlittFieldBaseHandle>()
    const mmRef = useRef<FlittFieldBaseHandle>()
    const yyRef = useRef<FlittFieldBaseHandle>()
    const cvvRef = useRef<FlittFieldBaseHandle>()

    useEffect(() => {
        numberRef.current = inputNumber()
        mmRef.current = inputExpMm()
        yyRef.current = inputExpYy()
        cvvRef.current = inputCvv()

        numberRef.current.__onChangeText__ = (text: string) => {
            cvvRef.current?._setMaxLength(isCvv4Length(text) ? 4 : 3)
        }
    }, [])

    useImperativeHandle(ref, () => ({
        isValid: () => {
            const numValid = numberRef.current?.isValid() ?? false
            const mm = mmRef.current?._getText() ?? ''
            const yy = yyRef.current?._getText() ?? ''
            const expiryValid = isValidExpireDate(+mm, +yy)
            const cvvValid = cvvRef.current?.isValid() ?? false
            return numValid && expiryValid && cvvValid
        },
        getCard: () => {
            if (!numberRef.current || !mmRef.current || !yyRef.current || !cvvRef.current) return null
            return {
                cardNumber: numberRef.current._getText(),
                expMm: mmRef.current._getText(),
                expYy: yyRef.current._getText(),
                cvv: cvvRef.current._getText()
            }
        },
        showCard: ({ cardNumber, expMm, expYy, cvv }) => {
            numberRef.current?._setText(cardNumber)
            mmRef.current?._setText(expMm)
            yyRef.current?._setText(expYy)
            cvvRef.current?._setText(cvv)
            numberRef.current?._setEnable(true)
            mmRef.current?._setEnable(true)
            yyRef.current?._setEnable(true)
            cvvRef.current?._setEnable(true)
        }
    }))

    return <View style={containerStyle}>{children}</View>
})
