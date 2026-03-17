import {Order} from "../models";

export interface BankPayCallback {
    onPaidSuccess: (response: any) => void;
    onPaidFailure: (error: Error) => void;
}
export interface IPayWithBankRequest {
    token?:string,
    order?:Order
}
export interface IBankPaymentResponse {
    action: "redirect";  // Type of action, only "redirect" in this case
    url: string;  // The URL to redirect to
    target: "_top" | "_blank";  // Specifies where to open the URL
    response_status: "success" | "failure";  // The status of the response
}

export interface IFeeCalculationResponse {
    discount_percent: number | null;
    discount_amount: number | null;
    fee_amount: number | null;
    total_amount: number | null;
    promo_status: string | null;
    message: string | null;
    cvv2_requirement: "required" | "optional" | "absent" | null;
}