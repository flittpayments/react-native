import {IOrder, IReceipt} from "../types";

export interface IPaymentSystem {
    country_priority: number
    user_priority: number
    quick_method: boolean
    user_popular: boolean
    name: string
    country: string
    bank_logo: string
    alias: string
}
export interface IBank extends IPaymentSystem{
    id: string;
}

type TPaymentMethods = Record<
    string, // like "card", "paypal", etc.
    {
        name: string
        payment_systems: Record<
            string, // like "card", "visa", "mastercard", etc.
            {
                name: string
            }
        >
    }
>

export interface ITabs {
    card: TPaymentMethods,
    trustly: {
        name?: string
        payment_systems: {
            [systemId: string]: IPaymentSystem
        }
    }
}

export interface IMerchantInfo {
    logo_url: string
    localized_name: string
    offerta_url: string
    merchant_url: string
    country: string
    promo: boolean
}

export interface ICheckoutOrder {
    amount: number
    actual_amount: number
    currency: string
    order_desc: string
    fee: number
    error_code: string | null
    error_description: string | null
    verification: boolean
    card_bin: string | null
    card_last_digit: string | null
    expire_month: string | null
    expire_year: string | null
    merchant_data: string
    button: boolean
    subscription: boolean
}


export interface IInfo {
    active_tab: string
    active_method: string | null
    tabs_order: string[]
    tabs: ITabs
    checkout_email_required: boolean
    checkout_phone_required: boolean
    client_fee: any
    customer_required_data: any[]
    merchant: IMerchantInfo
    target: string
    show_gdpr_frame: boolean
    validate_expdate: boolean
    istest: boolean
    required_one_of_checkout_customer_fields: any
    click2pay_init_enabled: boolean
    click2pay_checkout_registration_enabled: boolean
    country_user_by_ip: string
    click2pay_srci_dpa_id: string | null
    allowed_payment_system: string[]
    response_status: string
    // Optional fields
    order?: ICheckoutOrder
    lang?: string
    rectoken_autosubmit?: boolean
    delayed?: boolean
    default_country?: string
    response_url?: string
    order_data?: IReceipt
    pending?: boolean
}

export interface IInitiateBankPayment {
    merchantId: number;
    order?: IOrder;
    token?: string;
    bankId: number;
    autoRedirect?: boolean;
}

export interface IBankPaymentResponse {
    action: "redirect";  // Type of action, only "redirect" in this case
    url: string;  // The URL to redirect to
    target: "_top" | "_blank";  // Specifies where to open the URL
    response_status: "success" | "failure";  // The status of the response
}
