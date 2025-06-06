import React, {forwardRef} from "react";
import {FlittFieldBase, FlittFieldBaseHandle} from "../FlittTextInput/FlittTextInput";
import {TextInputProps} from "react-native";

export const FlittFieldExpYy = forwardRef<FlittFieldBaseHandle, TextInputProps>((props, ref) => (
    <FlittFieldBase
        {...props}
        ref={ref}
        getSelfName={() => 'FlittFieldExpYy'}
        maxLengthDefault={2}
        validate={(text) => true} // validation combined with MM in layout
    />
))
