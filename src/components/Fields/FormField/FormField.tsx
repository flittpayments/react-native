import React from 'react';
import {View, Text, TextInput, StyleSheet, TextInputProps, StyleProp, ViewStyle, TextStyle} from 'react-native';

interface FormFieldProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    inputStyle?: StyleProp<TextStyle>;
    errorStyle?: StyleProp<TextStyle>;
}

export const FormField: React.FC<FormFieldProps> = ({
                                                        label,
                                                        error,
                                                        containerStyle,
                                                        labelStyle,
                                                        inputStyle,
                                                        errorStyle,
                                                        ...textInputProps
                                                    }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[styles.label, labelStyle]}>{label}</Text>
            )}
            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : {},
                    inputStyle,
                ]}
                {...textInputProps}
                onBlur={(e) => {
                    textInputProps.onBlur?.(e);
                    // Additional blur handling if needed
                }}
            />
            {error && (
                <Text style={[styles.errorText, errorStyle]}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: '#ff4444',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 14,
        marginTop: 4,
    },
});

