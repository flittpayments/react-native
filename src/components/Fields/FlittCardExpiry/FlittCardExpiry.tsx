import React from "react";
import {View,StyleSheet} from "react-native";
import {useForm, UseFormReturn} from "../../../helpers/hooks/useForm";
import {FormField} from "../FormField/FormField";
import {isValidExpireDate} from "../../../helpers/utils/isValidCardNumber";

interface FlittCardExpiryProps {
    form?: UseFormReturn
}

export const FlittCardExpiry: React.FC<FlittCardExpiryProps> = ({ form }) => {

    const {register, watch} = form || useForm()
    return (
        <View style={styles.row}>
            <View style={styles.halfWidth}>
                <FormField
                    label="Expiry Month"
                    placeholder="MM"
                    {...register({
                        name: 'expMm',
                        rules: {
                            required: 'Month is required',
                            validate: (value: string) => {
                                const mm = parseInt(value);
                                const yy = parseInt(watch('expYy'));
                                return isValidExpireDate(mm, yy) || 'Invalid expiry date';
                            },
                        },
                    })}
                    keyboardType="numeric"
                    maxLength={2}
                />
            </View>

            <View style={styles.halfWidth}>
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
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },

});
