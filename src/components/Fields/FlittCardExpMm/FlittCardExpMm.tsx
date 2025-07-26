import React from 'react';
import {FormField} from "../FormField/FormField";
import {isValidExpireDate} from "../../../helpers/utils/isValidCardNumber";
import {useForm, UseFormReturn} from "../../../helpers/hooks/useForm";


interface FlittCardExpMmProps {
    form?: UseFormReturn
}

export const FlittCardExpMm: React.FC<FlittCardExpMmProps> = ({form}) => {
    const {register, watch} = form || useForm()
    return (
        <FormField
            label="Expiry Year"
            placeholder="YY"
            {...register({
                name: 'expYy',
                rules: {
                    required: 'Year is required',
                    validate: (value: string) => {
                        const mm = parseInt(watch('expMm'));
                        const yy = parseInt(value);
                        return isValidExpireDate(mm, yy) || 'Invalid expiry date';
                    },
                },
            })}
            keyboardType="numeric"
            maxLength={2}
        />
    );
};

