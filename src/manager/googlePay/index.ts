import {assertGooglePay, getPaymentConfig, payContinue} from "../common";
import {ApiManager} from "../ApiManager";
import {Native} from '../../Native';
import {IGooglePay, IGooglePayToken, IProcessGooglePayToken} from "./types";


export const googlePayToken = async ({token, merchantId, config}: IGooglePayToken) => {
    await assertGooglePay()
    if (config) {
        return processGooglePayToken({token, config})
    }
    const paymentConfig = await getPaymentConfig({
        token,
        merchantId,
        methodId: 'https://google.com/pay',
        methodName: 'GooglePay',
        amount:null,
        currency:null
    })
    await processGooglePayToken({token, config: paymentConfig})
}

const processGooglePayToken = async ({token, config}: IProcessGooglePayToken) => {
    try {
        const order = await ApiManager.getOrder(token)
        const googlePayInfo = await Native.googlePay(config?.data)
        const rqBody = {
            token,
            email: order.order_data.sender_email,
            payment_system: order.order_data.payment_system,
            data: googlePayInfo
        };

        const checkoutGooglePay = await ApiManager.checkout(rqBody)
        return await payContinue(checkoutGooglePay, token, order.response_url ?? '')
    } catch (error) {
        throw error;
    }
}


export const googlePay = async ({order, merchantId, config}: IGooglePay) => {
    await assertGooglePay()
    if (config) {
        return processGooglePay({order, merchantId, config})
    }
    const paymentConfig = await getPaymentConfig({
        amount: +order.amount,
        currency: order.currency,
        methodId: 'https://google.com/pay',
        methodName: 'GooglePay',
        merchantId
    })
    return processGooglePay({order, merchantId, config: paymentConfig})
}

const processGooglePay = async ({order, merchantId, config}: IGooglePay) => {
    try {
        const googlePayInfo = await Native.googlePay(config?.data)
        const {token} = await ApiManager.getToken(merchantId, order)
        const rqBody = {
            token,
            email: order.email,
            payment_system: config.payment_system,
            data: googlePayInfo
        };
        const checkoutGooglePay = await ApiManager.checkout(rqBody)
        const paymentOrder = await ApiManager.getOrder(token)
        return await payContinue(checkoutGooglePay, token, paymentOrder.response_url ?? '')
    } catch (error) {
        throw error;
    }
}
