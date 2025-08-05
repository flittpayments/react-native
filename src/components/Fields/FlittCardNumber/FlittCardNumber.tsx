import React, {FC} from "react"
import {Control, Controller, UseFormWatch, FieldErrors} from "react-hook-form"
import {utils} from "../../../helpers/utils"
import {FormField} from "../FormField/FormField"
import {formatCardNumber} from "../../../helpers/formatCardNumber";
import {ICardFormData} from "../../../types";


interface FlittFieldNumberProps {
    label?: string
    placeholder?: string
    name?: string
    error?: string
    errorNotValidCardNumber?: string
    control: Control<ICardFormData>
    watch: UseFormWatch<ICardFormData>
    errors: FieldErrors<ICardFormData>
}

export const FlittCardNumber: FC<FlittFieldNumberProps> = ({
                                                               placeholder = '1234 5678 9012 3456',
                                                               label = 'Card Number',
                                                               name = 'cardNumber',
                                                               error = 'Card number is required',
                                                               errorNotValidCardNumber = 'Invalid card number',
                                                               control,
                                                               errors
                                                           }) => {
    return (
        <Controller
            name={name as keyof ICardFormData}
            control={control}
            rules={{
                required: error,
                validate: (value: string) => {
                    const cleaned = value.replace(/\s/g, '')
                    return utils(cleaned) || errorNotValidCardNumber
                }
            }}
            render={({field: {onChange, onBlur, value}}) => (
                <FormField
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={(text) => {
                        const formatted = formatCardNumber(text)
                        onChange(formatted)
                    }}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    maxLength={19}
                    error={errors[name as keyof ICardFormData]?.message}
                />
            )}
        />
    )
}
