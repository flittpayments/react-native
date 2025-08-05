import React from "react"
import {Control, Controller, UseFormWatch, FieldErrors} from "react-hook-form"
import {isCvv4Length} from "../../../helpers/utils"
import {FormField} from "../FormField/FormField"
import {ICardFormData} from "../../../types";


interface FlittCardCvvProps {
    control: Control<ICardFormData>
    watch: UseFormWatch<ICardFormData>
    errors: FieldErrors<ICardFormData>
}

export const FlittCardCvv: React.FC<FlittCardCvvProps> = ({control, watch, errors}) => {
    const cardNumber = watch('cardNumber')
    return (
        <Controller
            name="cvv"
            control={control}
            rules={{
                required: 'CVV is required',
                validate: (value: string) => {
                    const requiredLength = isCvv4Length(cardNumber) ? 4 : 3
                    if (value.length !== requiredLength) {
                        return `CVV must be ${requiredLength} digits`
                    }
                    return true
                }
            }}
            render={({field: {onChange, onBlur, value}}) => (
                <FormField
                    label="CVV"
                    placeholder="123"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    maxLength={isCvv4Length(cardNumber) ? 4 : 3}
                    secureTextEntry
                    error={errors.cvv?.message}
                />
            )}
        />
    )
}
