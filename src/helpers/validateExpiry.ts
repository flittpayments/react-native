import {parseExpiry} from "./parseExpiry";
import * as cardValidator from "card-validator";

export const validateExpiry = (value: string): boolean | string => {
    const { month, year } = parseExpiry(value)

    if (!month || !year) return 'Expiry date is required'

    const validation = cardValidator.expirationDate(`${month}/${year}`)

    if (!validation.isValid) {
        if (validation.isPotentiallyValid) return true

        // Check if expired
        const now = new Date()
        const expYear = parseInt(`20${year}`, 10)
        const expMonth = parseInt(month, 10)

        if (expYear < now.getFullYear() ||
            (expYear === now.getFullYear() && expMonth < now.getMonth() + 1)) {
            return 'Card has expired'
        }

        return 'Invalid expiry date'
    }

    return true
}
