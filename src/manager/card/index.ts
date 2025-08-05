import {buildExp, isValidCard} from "../../helpers/utils";
import {ApiManager} from "../ApiManager";
import {payContinue} from "../common";
import {CallbackURL} from "../../helpers/constants";
import {IPayOrder, IPayToken} from "./types";

export const pay = async ({cardNumber, mm, yy, cvv, order, merchantId, email}: IPayOrder) => {
    try {
        if (!isValidCard(cardNumber, mm, yy, cvv)) {
            throw new Error('Card is not valid');
        }
        const response = await ApiManager.getToken(merchantId, order);
        if (!response.token) throw new Error(JSON.stringify(response));
        const {token} = response;

        const rqBody = {
            card_number: cardNumber,
            expiry_date: buildExp(mm, yy),
            token,
            email,
            payment_system: 'card',
            cvv,
            merchant_id: merchantId
        };
        const checkout = await ApiManager.checkout(rqBody)
        return await payContinue(checkout, token, CallbackURL)
    } catch (error) {
        throw error;
    }
}

export const payToken = async ({cardNumber, mm, yy, cvv, token, merchantId}: IPayToken) => {
    try {
        if (!isValidCard(cardNumber, mm, yy, cvv)) {
            throw new Error('Card is not valid');
        }
        const order = await ApiManager.getOrder(token)
        const callbackUrl = order.response_url
        const checkout = await ApiManager.checkout({
            token,
            card_number: cardNumber,
            cvv: cvv,
            expiry_date: buildExp(mm, yy),
            merchant_id: merchantId,
            payment_system: 'card',
        })
        return await payContinue(checkout, token, callbackUrl)
    } catch (error) {
        throw error;
    }
}
