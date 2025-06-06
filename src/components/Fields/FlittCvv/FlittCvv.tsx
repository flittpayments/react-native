import {FlittFieldBase, FlittFieldBaseHandle} from "../FlittTextInput/FlittTextInput";
import {TextInputProps} from "react-native";
import {forwardRef} from "react";
import {isValidCvv} from "../../../helpers/utils/isValidCardNumber";
export const FlittFieldCvv = forwardRef<FlittFieldBaseHandle, TextInputProps>((props, ref) => (
    <FlittFieldBase
        {...props}
        ref={ref}
        getSelfName={() => 'FlittFieldCvv'}
        isSecure={true}
        maxLengthDefault={3}
        // validate={(text) => isValidCvv(text, text.length === 4)}
    />
))
