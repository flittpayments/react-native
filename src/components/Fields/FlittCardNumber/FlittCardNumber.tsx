import React, {forwardRef} from "react";
import {FlittFieldBase, FlittFieldBaseHandle} from "../FlittTextInput/FlittTextInput";
import {TextInputProps} from "react-native";
import {isValidCardNumber} from "../../../helpers/utils/isValidCardNumber";
export const FlittFieldNumber = forwardRef<FlittFieldBaseHandle, TextInputProps>((props, ref) => (
    <FlittFieldBase
        {...props}
        ref={ref}
        getSelfName={() => 'FlittFieldNumber'}
        maxLengthDefault={19}
        validate={isValidCardNumber}
    />
))
