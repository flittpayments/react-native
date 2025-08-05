import React, {FC, useEffect, useState, useMemo} from 'react'
import {View, Text, TouchableOpacity, Image} from 'react-native'
import {useForm, SubmitHandler, Controller} from 'react-hook-form'
import * as cardValidator from 'card-validator'
import {useFlitt} from "../../../Flitt"
import {IFlittProps} from "../FlittForm/types"
import {FormField} from "../FormField/FormField"
import {isCvv4Length} from "../../../helpers/utils"
import {
    CARD_MAX_LENGTHS,
    CARD_TYPE_IMAGE_BASE_URL,
    DEFAULT_CVV4_LENGTH,
    DEFAULT_CVV_LENGTH
} from "../../../helpers/constants";
import {validateCardNumber} from "../../../helpers/validateCardNumber";
import {formatCardNumber} from "../../../helpers/formatCardNumber";
import {validateExpiry} from "../../../helpers/validateExpiry";
import {formatExpiry} from "../../../helpers/formatExpiry";
import {validateCvv} from "../../../helpers/validateCvv";
import {styles} from "./styles";


export interface ICardFormData {
    cardNumber: string
    cvv: string
    expiry: string
}

export const FlittCardForm: FC<IFlittProps> = ({
                                                   order,
                                                   onError,
                                                   onStart,
                                                   onSuccess,
                                                   title
                                               }) => {
    const [cardType, setCardType] = useState<string | null>(null)

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
            expiry: '',
            cvv: ''
        }
    })

    const watchedCardNumber = watch('cardNumber')

    useEffect(() => {
        const cleaned = watchedCardNumber?.replace(/\s/g, '') || ''
        const validation = cardValidator.number(cleaned)
        setCardType(validation.card?.type || null)
    }, [watchedCardNumber])

    const cardMaxLength = useMemo(() => {
        if (cardType && CARD_MAX_LENGTHS[cardType]) {
            return CARD_MAX_LENGTHS[cardType]
        }
        return 16
    }, [cardType])

    const cvvMaxLength = useMemo(() => {
        const cleaned = watchedCardNumber?.replace(/\s/g, '') || ''
        return isCvv4Length(cleaned) ? DEFAULT_CVV4_LENGTH : DEFAULT_CVV_LENGTH
    }, [watchedCardNumber])

    const cardTypeImageUrl = useMemo(() => {
        if (!cardType) return null
        const imageName = cardType.replace('-', '_')
        return `${CARD_TYPE_IMAGE_BASE_URL}/${imageName}.svg`
    }, [cardType])

    const onSubmit: SubmitHandler<ICardFormData> = async (data) => {
        try {
            createCardPayment({
                order,
                data,
                onSuccess,
                onError,
                onStart
            })
        } catch (error) {
            onError?.(error)
        }
    }

    return (
        <View style={styles.container}>
            {title && <Text style={styles.formTitle}>{title}</Text>}

            <View style={styles.card}>
                {cardTypeImageUrl && (
                    <Image
                        source={{uri: cardTypeImageUrl}}
                        style={styles.cardLogo}
                        resizeMode="contain"
                    />
                )}

                <Controller
                    name="cardNumber"
                    control={control}
                    rules={{
                        required: 'Card number is required',
                        validate: validateCardNumber
                    }}
                    render={({field: {onChange, onBlur, value}}) => (
                        <FormField
                            label="CARD NUMBER"
                            value={formatCardNumber(value || '')}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                const cleaned = text.replace(/\D/g, '')
                                if (cleaned.length <= cardMaxLength) {
                                    onChange(cleaned)
                                }
                            }}
                            onBlur={onBlur}
                            placeholder="1234 5678 9012 3456"
                            placeholderTextColor="#aaa"
                            error={errors.cardNumber?.message}
                            labelStyle={styles.label}
                            inputStyle={styles.input}
                            errorStyle={styles.error}
                            containerStyle={styles.fieldContainer}
                        />
                    )}
                />

                <View style={styles.row}>
                    <View style={styles.column}>
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
                                    labelStyle={styles.label}
                                    inputStyle={styles.input}
                                    errorStyle={styles.error}
                                    containerStyle={styles.fieldContainer}
                                />
                            )}
                        />
                    </View>

                    <View style={styles.column}>
                        <Controller
                            name="cvv"
                            control={control}
                            rules={{
                                required: 'CVV is required',
                                validate: (value) => validateCvv(value, watchedCardNumber || '')
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <FormField
                                    label="CVV2/CVC2"
                                    value={value || ''}
                                    keyboardType="numeric"
                                    maxLength={cvvMaxLength}
                                    secureTextEntry
                                    placeholder={cvvMaxLength === 4 ? '****' : '***'}
                                    placeholderTextColor="#aaa"
                                    onChangeText={(text) => {
                                        const cleaned = text.replace(/\D/g, '')
                                        onChange(cleaned)
                                    }}
                                    onBlur={onBlur}
                                    error={errors.cvv?.message}
                                    labelStyle={styles.label}
                                    inputStyle={styles.input}
                                    errorStyle={styles.error}
                                    containerStyle={styles.fieldContainer}
                                />
                            )}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        (!isValid || isSubmitting) && styles.submitButtonDisabled
                    ]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={!isValid || isSubmitting}
                >
                    <Text style={styles.submitButtonText}>
                        {isSubmitting ? 'Processing...' : 'Pay Now'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

