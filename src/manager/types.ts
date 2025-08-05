export type ILang =
    | 'az' | 'da' | 'nl' | 'fi' | 'ka' | 'ko' | 'ru' | 'zh'
    | 'uk' | 'en' | 'lv' | 'fr' | 'cs' | 'ro' | 'it' | 'sk'
    | 'pl' | 'es' | 'hu' | 'de';

export type IYN = 'Y' | 'N'

export interface IGetTokenResponse {
    response_status: string,
    token: string
}

export interface IOrder {
    merchant_id?: number
    amount: string | number
    currency: string
    order_id: string
    order_desc?: string
    description?: string;
    email?: string;

    arguments?: { [key: string]: string };

    product_id?: string;
    response_url?: string;
    payment_systems?: string;
    default_payment_system?: string;
    life_time?: number;
    merchant_data?: string;
    version?: string;
    server_callback_url?: string;
    lang?: ILang;
    pre_auth?: boolean;
    required_rectoken?: boolean;
    verification?: boolean;
    verification_type?: string;
    delayed?: boolean;
    lifetime?: number
}

export type TPrivateOrder = Omit<IOrder, 'required_rectoken' | 'pre_auth' | 'verification' | 'delayed'> & {
    pre_auth: IYN
    required_rectoken: IYN
    verification: IYN
    delayed: IYN
}


export interface IReceipt {
    api_version: string
    click2pay_success_page_registration_enabled: boolean
    method: string
    order_data: IReceiptData
    pending: boolean
    response_status: string
    response_url: string
    show_success_page: boolean
    target: string
}

export interface IReceiptData {
    actual_amount: string
    actual_currency: string
    additional_info: AdditionalInfo // JSON string, can be parsed to `AdditionalInfo`
    amount: string
    approval_code: string
    card_bin: number
    card_type: string
    currency: string
    eci: string
    fee: string
    masked_card: string
    merchant_data: string
    merchant_id: number
    order_id: string
    order_status: string
    order_time: string
    parent_order_id: string
    payment_id: number
    payment_system: string
    product_id: string
    rectoken: string
    rectoken_lifetime: string
    response_code: string
    response_description: string
    response_signature_string: string
    response_status: string
    reversal_amount: string
    rrn: string
    sender_account: string
    sender_cell_phone: string
    sender_email: string
    settlement_amount: string
    settlement_currency: string
    settlement_date: string
    signature: string
    tran_type: string
    verification_status: string
}

export interface AdditionalInfo {
    capture_status: null | string
    capture_amount: null | number
    reservation_data: string
    transaction_id: null | string
    bank_response_code: null | string
    bank_response_description: null | string
    client_fee: null | number
    settlement_fee: number
    bank_name: string
    bank_country: string
    card_type: string
    card_product: string
    card_category: null | string
    timeend: null | string
    ipaddress_v4: string
    payment_method: string
}



export interface IOrderData {
    maskedCard: string;
    cardBin: number;
    amount: number;
    paymentId: number;
    currency: string;
    status: string;
    transactionType: string;
    senderCellPhone: string;
    senderAccount: string;
    cardType: string;
    rrn: string;
    approvalCode: string;
    responseCode: string;
    productId: string;
    recToken: string;
    recTokenLifeTime?: Date;
    reversalAmount: number | string;
    settlementAmount: number | string;
    settlementCurrency: string;
    settlementDate?: Date;
    eci: string;
    fee: number | string;
    actualAmount: number | string;
    actualCurrency: string;
    paymentSystem: string;
    verificationStatus: string;
    signature: string;
    email: string;
    responseUrl?: string;
}

export interface ICheckout {
    autoRedirect?:boolean,
    amount?: string | number
    fee?: number
    currency?: string
    recurring?: string
    card_number?: string
    merchant_id?: number
    kkh?: string
    hash?: string
    expiry_date?: string
    cvv2?: string
    cvv?: string
    email?: string
    code?: string
    order_desc?: string
    offer?: boolean
    customer_data?: Record<string, any>
    form?: Record<string, any>
    order_id?: string
    save_card?: boolean
    token?: string
    payment_system: number | string
    referrer?: string
    embedded?: boolean
    location?: string
}

export interface ITokenReq {
    token?: string;
}

export interface IOrderReq {
    merchant_id: number;
    currency?: string;
    amount?: number;
}

export type TMobileRequest = ITokenReq | IOrderReq;

export interface IGetPaymentConfigProps {
    amount?:number | null
    currency?: string | null,
    token?: string,
    methodId: string,
    methodName: string,
    merchantId:number
}



