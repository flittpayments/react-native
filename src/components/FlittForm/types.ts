import {IOrder, IReceipt} from "../../manager/types";

export interface IFlittProps {
    order: IOrder
    onSuccess?: (receipt: IReceipt) => void;
    onError?: (error: any) => void;
    onStart?: () => void,
    title?:string
}
