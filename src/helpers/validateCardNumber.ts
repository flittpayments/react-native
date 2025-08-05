import cardValidator from "card-validator";

export const validateCardNumber = (value: string): boolean | string => {
    const cleaned = value.replace(/\s/g, '')
    const validation = cardValidator.number(cleaned)

    if (cleaned.length < 12) return true // Allow partial input

    if (!validation.isValid) {
        return validation.isPotentiallyValid ? true : 'Invalid card number'
    }

    return true
}
