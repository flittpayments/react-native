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
