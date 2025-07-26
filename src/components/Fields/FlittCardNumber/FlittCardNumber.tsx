import React, {FC} from "react";
import {isValidCardNumber} from "../../../helpers/utils/isValidCardNumber";
import {FormField} from "../FormField/FormField";
import {UseFormReturn, useForm} from "../../../helpers/hooks/useForm";

interface FlittFieldNumberProps {
    label?: string
    placeholder?: string
    name?: string
    error?: string
    errorNotValidCardNumber?: string
    form?: UseFormReturn
}

export const FlittCardNumber: FC<FlittFieldNumberProps> = ({
                                                                placeholder = '1234 5678 9012 3456',
                                                                label = 'Card Number',
                                                                name = 'cardNumber',
                                                                error = 'Card number is required',
                                                                errorNotValidCardNumber = 'Invalid card number',
                                                                form
                                                            }) => {

    const {register} = form || useForm()

    return (
            <FormField
                label={label}
                placeholder={placeholder}
                {...register({
                    name: name,
                    rules: {
                        required: error,
                        validate: (value: string) => {
                            const formatted = value.replace(/\s/g, '');
                            return isValidCardNumber(formatted) || errorNotValidCardNumber;
                        },
                    },
                })}
                keyboardType="numeric"
                maxLength={19}
                onChangeText={(text) => {
                    const formatted = text.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                    register({
                        name: name,
                        rules: {
                            required: error,
                            validate: (value: string) => {
                                const clean = value.replace(/\s/g, '');
                                return isValidCardNumber(clean) || errorNotValidCardNumber;
                            },
                        },
                    }).onChangeText(formatted);
                }}
            />
    )
}

