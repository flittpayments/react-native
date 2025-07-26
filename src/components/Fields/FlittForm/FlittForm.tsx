import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {FlittCardNumber} from "../FlittCardNumber/FlittCardNumber";
import {FlittCardExpiry} from "../FlittCardExpiry/FlittCardExpiry";
import {FlittCardCvv} from "../FlittCardCvv/FlittCardCvv";
import {useForm} from "../../../helpers/hooks/useForm";

export const FlittForm = () => {

    const form = useForm();

    const {
        handleSubmit,
        formState: {isValid, isSubmitting,errors},
    } = form;

    const onSubmit = (data: any) => {
        console.log('Form submitted:', data);
        // Handle form submission
    };

    console.log('errors',errors)

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Card Details</Text>

            <FlittCardNumber form={form} />
            <FlittCardExpiry form={form} />
            <FlittCardCvv form={form} />

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
});
