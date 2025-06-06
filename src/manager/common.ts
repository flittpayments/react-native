import {Platform} from "react-native";
import {Native} from "../Native";
import {IGetPaymentConfigProps, IOrder, IOrderData, IReceipt, TPrivateOrder} from "./types";
import {BaseURL, CallbackURL} from "../helpers/constants";
import {ApiManager} from "./ApiManager";
import {flittWebViewRef} from "../components/Webview";

export const assertApplePay = () => {
    if (Platform.OS !== 'ios') {
        return Promise.reject(new Error('ApplePay available only for iOS'));
    }
}

export const assertGooglePay = () => {
    if (Platform.OS !== 'android') {
        return Promise.reject(new Error('GooglePay available only for Android'));
    }
}
export const supportsApplePay = (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
        return Native.supportsApplePay();
    } else {
        return Promise.resolve(false);
    }
}

export const supportsGooglePay = (): Promise<boolean> => {
    if (Platform.OS === 'android') {
        return Native.supportsGooglePay();
    } else {
        return Promise.resolve(false);
    }
}


export const getOrderObject = ({merchantId, order}: { merchantId: number, order: IOrder }) => {
    let rqBody = {} as Partial<TPrivateOrder>;
    rqBody.merchant_id = merchantId;
    rqBody.amount = String(order.amount);
    rqBody.currency = order.currency;
    rqBody.order_id = order.order_id;
    rqBody.order_desc = order.order_desc;
    rqBody.email = order.email;

    if (order.product_id) {
        rqBody.product_id = order.product_id;
    }
    if (order.payment_systems) {
        rqBody.payment_systems = order.payment_systems;
    }
    if (order.default_payment_system) {
        rqBody.default_payment_system = order.default_payment_system;
    }
    if (order.lifetime) {
        rqBody.lifetime = order.lifetime;
    }
    if (order.merchant_data === undefined) {
        rqBody.merchant_data = '[]';
    } else {
        rqBody.merchant_data = order.merchant_data;
    }
    if (order.version) {
        rqBody.version = order.version;
    }
    if (order.server_callback_url) {
        rqBody.server_callback_url = order.server_callback_url;
    }
    if (order.lang) {
        rqBody.lang = order.lang;
    }
    rqBody.pre_auth = order.pre_auth ? 'Y' : 'N';

    rqBody.required_rectoken = order.required_rectoken ? 'Y' : 'N';

    rqBody.verification = order.verification ? 'Y' : 'N';

    if (order.verification_type) {
        rqBody.verification_type = order.verification_type;
    }
    rqBody = Object.assign(rqBody, order.arguments);
    rqBody.response_url = CallbackURL;
    rqBody.delayed = order.delayed ? 'Y' : 'N';
    return rqBody
}


export const payContinue = async (checkoutResponse: any, token: string, callbackUrl: string) => {
    const getOrder = ApiManager.getOrder(token)
    if (checkoutResponse.url.startsWith(callbackUrl)) {
        return getOrder;
    } else {
        await url3ds(checkoutResponse, callbackUrl);
        return getOrder
    }
}

export const url3ds = async (checkout: any, callbackUrl: string) => {
    let body;
    let contentType;
    let sendData = checkout.send_data;
    if (sendData.PaReq === '') {
        body = JSON.stringify(sendData);
        contentType = 'application/json';
    } else {
        body = 'MD=' + encodeURIComponent(sendData.MD) +
            '&PaReq=' + encodeURIComponent(sendData.PaReq) +
            '&TermUrl=' + encodeURIComponent(sendData.TermUrl);
        contentType = 'application/x-www-form-urlencoded'
    }
    let cookies: string | null;
    const response = await fetch(checkout.url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': contentType,
            'User-Agent': 'React-Native'
        },
        body: body
    })
    cookies = response.headers.get('set-cookie');
    const html = await response.text()

    await flittWebViewRef.current?.__confirm__(
        checkout.url,
        html,
        cookies,
        BaseURL,
        callbackUrl
    );
}


export const getPaymentConfig = async ({
                                    amount,
                                    currency,
                                    token,
                                    methodId,
                                    methodName,
                                    merchantId
                                }: IGetPaymentConfigProps) => {
    const request = token ?
        {token} :
        {
            merchant_id: merchantId,
            currency:currency ,
            amount:amount
        };
    const response = await ApiManager.checkoutMobilePay(request)
    if (response.error_message) {
        handleResponseError(response)
    }
    let data;
    for (let i = 0; i < response.methods.length; ++i) {
        const method = response.methods[i];
        if (method.supportedMethods === methodId) {
            data = method.data;
            break;
        }
    }
    if (!data) {
        if (token) {
            throw new Error(`${methodName} is not supported for token "${token}"`);
        } else {
            throw new Error(`${methodName} is not supported for merchant ${merchantId} and currency ${currency}`);
        }
    }
    const totalDetails = response.details.total;

    return {
        payment_system: response.payment_system,
        data,
        businessName: totalDetails.label
    }
}

function handleResponseError(response: any): Error {
    const failure = new Error(response?.error_message) as Error & { errorCode: string, requestId: string };
    failure.errorCode = response?.error_code;
    failure.requestId = response?.request_id;

    failure.toString = function () {
        return 'Failure. ' + Error.prototype.toString.call(this) + ', errorCode: ' + this.errorCode + ', requestId: ' + this.requestId;
    };

    return failure;
}

// export function fromOrderData(orderData: IReceipt, responseUrl?: string): IOrderData {
//     return {
//         maskedCard:orderData.masked_card,
//         cardBin:orderData.card_bin,
//         amount:Number(orderData.amount),
//         paymentId:orderData.payment_id,
//         currency:orderData.currency,
//         status:orderData.order_status,
//         transactionType:orderData.tran_type,
//         senderCellPhone:orderData.sender_cell_phone,
//         senderAccount:orderData.sender_account,
//         cardType:orderData.card_type,
//         rrn:orderData.rrn,
//         approvalCode:orderData.approval_code,
//         responseCode:orderData.response_code,
//         productId:orderData.product_id,
//         recToken:orderData.rectoken,
//         recTokenLifeTime:easyDateParser(orderData.rectoken_lifetime),
//         reversalAmount:orderData.reversal_amount,
//         settlementAmount:orderData.settlement_amount,
//         settlementCurrency:orderData.settlement_currency,
//         settlementDate:easyDateParser(orderData.settlement_date),
//         eci:orderData.eci,
//         fee:orderData.fee,
//         actualAmount:orderData.actual_amount,
//         actualCurrency:orderData.actual_currency,
//         paymentSystem:orderData.payment_system,
//         verificationStatus:orderData.verification_status,
//         signature:orderData.signature,
//         email:orderData.email,
//         responseUrl,
//     };
// }

// Utility function to parse dates
function easyDateParser(str: string):Date | undefined {
    try {
        if (!str || str.length === 0) {
            return undefined;
        }
        const [date, time] = str.split(' ');
        const [days, months, years] = date.split('.');
        const [hours, minutes, seconds] = time.split(':');
        return new Date(
            Number(years),
            Number(months) - 1,
            Number(days),
            Number(hours),
            Number(minutes),
            Number(seconds),
            0
        );
    } catch (e) {
        return undefined;
    }
}


