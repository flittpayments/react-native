import {IOrderData} from "../../manager/types";

export type FlittWebViewState =
    | { baseUrl: undefined }
    | {
    baseUrl: string;
    html: string;
    cookies: string | null;
    apiHost: string;
    callbackUrl: string;
};

export interface FlittWebviewPrivate {
    __confirm__(
        baseUrl: string,
        html: string,
        cookies: string | null,
        apiHost: string,
        callbackUrl: string
    ): Promise<IOrderData>;
}
