import {StyleProp, ViewStyle, TextStyle, ImageStyle} from "react-native";
import {IOrder} from "../../manager/types";
import {IBank, IBankPaymentResponse} from "../../manager/bank/types";

export interface IBankListProps {
    token?: string;
    order?: IOrder;

    // Style props with proper typing
    containerStyle?: StyleProp<ViewStyle>;
    listContentStyle?: StyleProp<ViewStyle>;
    itemStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    logoContainerStyle?: StyleProp<ViewStyle>;

    // Display options
    showCountry?: boolean;
    countryTextStyle?: StyleProp<TextStyle>;

    //callbacks
    // onSuccess?:(response:IBankPaymentResponse) => void,
    // onError?:(error:Error) => void
    // onStart?:() => void

    onSuccess:(response:IBank[] | IBankPaymentResponse) => void
    onError:(error:Error) => void
    onStart:() => void

    autoRedirect?:boolean
}


