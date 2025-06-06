import React, {forwardRef} from "react";
import {FlittFieldBase, FlittFieldBaseHandle} from "../FlittTextInput/FlittTextInput";
import {TextInputProps} from "react-native";
export const FlittFieldExpMm = forwardRef<FlittFieldBaseHandle, TextInputProps>((props, ref) => (
    <FlittFieldBase
        {...props}
        ref={ref}
        getSelfName={() => 'FlittFieldExpMm'}
        maxLengthDefault={2}
        validate={(text) => true} // validation combined with YY in layout
    />
))
