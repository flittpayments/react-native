import {assertApplePay, getPaymentConfig, payContinue} from "../common";
import {ApiManager} from "../ApiManager";
import {Native} from '../../Native';
import {IApplePay, IApplePayToken} from "./types";

export const applePayToken = async ({token, merchantId}:IApplePayToken) => {
    try {
        await assertApplePay()
        const order = await ApiManager.getOrder(token)
        const { amount,currency } = order.order_data
        const paymentConfig = await getPaymentConfig({
            amount:+amount,
            currency,
            token,
            methodId: 'https://apple.com/apple-pay',
            methodName: 'ApplePay',
            merchantId
        });
        const applePayInfo = await Native.applePay(paymentConfig, +amount, currency, ' ')

        const rqBody = {
            token,
            email: order.order_data.sender_email,
            payment_system: paymentConfig.payment_system,
            data: applePayInfo
        };

        const checkoutApplePay = await ApiManager.checkout(rqBody)
        const receipt = payContinue(checkoutApplePay, token, order.response_url ?? '')
        await Native.applePayComplete(true)
        return receipt
    } catch (error) {
        Native.applePayComplete(false);
        throw error;
    }
}

export const applePay = async ({order, merchantId}:IApplePay) => {
    try {
        await assertApplePay();
        const paymentConfig = await getPaymentConfig({
            amount: +order.amount,
            currency: order.currency,
            methodId: 'https://apple.com/apple-pay',
            methodName: 'ApplePay',
            merchantId
        })
        const applePayInfo = await Native.applePay(paymentConfig, +order.amount, order.currency, order.description ?? '')
        const {token} = await ApiManager.getToken(merchantId, order)
        const rqBody = {
            token,
            email: order.email,
            payment_system: paymentConfig.payment_system,
            data: applePayInfo
        };
        const checkoutApplePay = await ApiManager.checkout(rqBody)
        const receipt = payContinue(checkoutApplePay, token, order.response_url ?? '')
        await Native.applePayComplete(true)
        return receipt
    } catch (error) {
        Native.applePayComplete(false);
        throw error;
    }
}
