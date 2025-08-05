export const FlittBankIcons = 'https://sandbox.pay.flitt.dev/icons/dist/png/128/banks/'
// export const FlittBankIcons = 'https://pay.flitt.com/icons/dist/svg/banks/'

export const BaseURL = 'https://sandbox.pay.flitt.dev';
// private readonly __baseUrl__ = 'https://pay.flitt.com';

export const CallbackURL = 'http://callback';


export const urlStartPattern = 'http://secure-redirect.cloudipsp.com/submit/#';


export const CARD_TYPE_IMAGE_BASE_URL = 'https://sandbox.pay.flitt.dev/icons/dist/svg/card/max'
export const DEFAULT_CVV_LENGTH = 3
export const DEFAULT_CVV4_LENGTH = 4

// Card type specific max lengths
export const CARD_MAX_LENGTHS: Record<string, number> = {
    visa: 19,
    mastercard: 16,
    'american-express': 15,
    discover: 16,
    maestro: 19,
    'diners-club': 14,
    jcb: 16,
    unionpay: 19,
    mir: 16,
}
