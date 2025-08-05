import {isCvv4Length} from "./utils";
import cardValidator from "card-validator";
import {DEFAULT_CVV4_LENGTH, DEFAULT_CVV_LENGTH} from "./constants";

export const validateCvv = (value: string, cardNumber: string): boolean | string => {
    const cleaned = cardNumber.replace(/\s/g, '')
    const expectedLength = isCvv4Length(cleaned) ? DEFAULT_CVV4_LENGTH : DEFAULT_CVV_LENGTH

    const validation = cardValidator.cvv(value, expectedLength)

    if (!validation.isValid) {
        return validation.isPotentiallyValid
            ? true
            : `CVV must be ${expectedLength} digits`
    }

    return true
}
