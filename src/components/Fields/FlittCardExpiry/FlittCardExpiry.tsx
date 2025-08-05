import React from "react"
import {Control, Controller, FieldErrors} from "react-hook-form"
import {FormField} from "../FormField/FormField"
import {formatExpiry} from "../../../helpers/formatExpiry";
import {validateExpiry} from "../../../helpers/validateExpiry";

interface FormData {
    cardNumber: string
    cvv: string
    expiry:string
}

interface FlittCardExpiryProps {
    control: Control<FormData>
    errors: FieldErrors<FormData>
}

export const FlittCardExpiry: React.FC<FlittCardExpiryProps> = ({control, errors}) => {
    return (
        <Controller
            name="expiry"
            control={control}
            rules={{
                required: 'Expiry date is required',
                validate: validateExpiry
            }}
            render={({field: {onChange, onBlur, value}}) => (
                <FormField
                    label="MM/YY"
                    value={formatExpiry(value || '')}
                    keyboardType="numeric"
                    maxLength={5}
                    placeholder="11/24"
                    placeholderTextColor="#aaa"
                    onChangeText={(text) => {
                        const cleaned = text.replace(/\D/g, '')
                        if (cleaned.length <= 4) {
                            onChange(cleaned)
                        }
                    }}
                    onBlur={onBlur}
                    error={errors.expiry?.message}
                />
            )}
        />
    )
}

