import React, {FC} from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {useForm, SubmitHandler} from 'react-hook-form'
import {FlittCardNumber} from "../FlittCardNumber/FlittCardNumber"
import {FlittCardExpiry} from "../FlittCardExpiry/FlittCardExpiry"
import {FlittCardCvv} from "../FlittCardCvv/FlittCardCvv"
import {useFlitt} from "../../../Flitt"
import {IFlittProps} from "./types";
import {ICardFormData} from "../../../types";


export const FlittForm: FC<IFlittProps> = ({order, onError, onStart, onSuccess, title}) => {
    const {createCardPayment} = useFlitt()

    const {
        control,
        handleSubmit,
        watch,
        formState: {isValid, isSubmitting, errors}
    } = useForm<ICardFormData>({
        mode: 'onChange',
        defaultValues: {
            cardNumber: '',
            cvv: '',
            expiry: '',
        }
    })

    const onSubmit: SubmitHandler<ICardFormData> = async (data) => {
        try {
            createCardPayment({
                order,
                data,
                onSuccess,
                onError,
                onStart
            })
        } catch (e) {
            onError?.(e)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title || 'Card Details'}</Text>

            <FlittCardNumber control={control} watch={watch} errors={errors}/>
            <FlittCardExpiry control={control} errors={errors}/>
            <FlittCardCvv control={control} watch={watch} errors={errors}/>

            <TouchableOpacity
                style={[
                    styles.submitButton,
                    (!isValid || isSubmitting) && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || isSubmitting}
            >
                <Text style={styles.submitButtonText}>
                    {isSubmitting ? 'Processing...' : 'Submit'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})
