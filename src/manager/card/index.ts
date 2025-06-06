import {buildExp, isValidCard} from "../../helpers/utils/isValidCardNumber";
import {ApiManager} from "../ApiManager";
import {payContinue} from "../common";
import {CallbackURL} from "../../helpers/constants";
import {IPayOrder, IPayToken} from "./types";

export const pay = async ({cardNumber, mm, yy, cvv, order, merchantId, email}: IPayOrder) => {
    if (isValidCard(cardNumber, mm, yy, cvv)) {
        throw new Error('Card is not valid');
    }
    const {token} = await ApiManager.getToken(merchantId, order)

    const rqBody = {
        card_number: cardNumber,
        expiry_date: buildExp(mm, yy),
        token,
        email,
        payment_system: 'card',
        cvv,
        merchant_id:merchantId
    };
    const checkout = await ApiManager.checkout(rqBody)
    await payContinue(checkout, token, CallbackURL)
}

export const payToken = async ({cardNumber, mm, yy, cvv, token, merchantId}: IPayToken) => {
    if (isValidCard(cardNumber, mm, yy, cvv)) {
        throw new Error('Card is not valid');
    }
    const order = await ApiManager.getOrder(token)
    const callbackUrl = order.response_url
    const checkout = await ApiManager.checkout({
        token,
        card_number: cardNumber,
        cvv: cvv,
        expiry_date: buildExp(mm, yy),
        merchant_id:merchantId,
        payment_system: 'card',
    })
    await payContinue(checkout,token,callbackUrl)
}
