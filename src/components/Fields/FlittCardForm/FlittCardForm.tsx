import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
} from 'react-native';
import valid, {
    number as isValidNumber,
    expirationDate as isValidExpDate,
} from 'card-validator';

// Constants
export const CvvLength = 3;
export const ExpLength = 5;
export const CardNumberLength = 16;

export const CartTypeImageBaseURL = 'https://sandbox.pay.flitt.dev/icons/dist/svg/card/max';

export const CardMaxLengths: Record<string, number> = {
    visa: 19,
    mastercard: 16,
    'american-express': 15,
    discover: 16,
    maestro: 19,
    'diners-club': 14,
    jcb: 16,
    unionpay: 19,
    mir: 16,
};

export const callbackUrl = 'http://callback';

const UNDER_SCORE = '_';

const formatCardNumber = (number: string, maxLength: number) => {
    const sanitized = number.replace(/\D/g, '');
    const padded = sanitized + UNDER_SCORE.repeat(maxLength - sanitized.length);
    return padded.match(/.{1,4}/g)?.join(' ') ?? '';
};

export const FlittCardForm = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardType, setCardType] = useState<string | null>(null);

    const [errors, setErrors] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
    });

    const getCardMaxLength = () => {
        if (cardType && CardMaxLengths[cardType]) {
            return CardMaxLengths[cardType];
        }
        return CardNumberLength;
    };

    useEffect(() => {
        const result = isValidNumber(cardNumber);
        setCardType(result.card?.type ?? null);

        if (cardNumber.length >= 12 && !result.isValid) {
            setErrors((prev) => ({ ...prev, cardNumber: 'Invalid card number' }));
        } else {
            setErrors((prev) => ({ ...prev, cardNumber: '' }));
        }
    }, [cardNumber]);

    useEffect(() => {
        if (expiry.length === ExpLength) {
            const result = isValidExpDate(expiry);
            if (!result.isValid) {
                setErrors((prev) => ({ ...prev, expiry: 'Invalid expiry' }));
            } else {
                const [month, year] = expiry.split('/');
                const now = new Date();
                const expYear = parseInt('20' + year, 10);
                const expMonth = parseInt(month, 10);
                if (expYear < now.getFullYear() || (expYear === now.getFullYear() && expMonth < now.getMonth() + 1)) {
                    setErrors((prev) => ({ ...prev, expiry: 'Card expired' }));
                } else {
                    setErrors((prev) => ({ ...prev, expiry: '' }));
                }
            }
        }
    }, [expiry]);

    useEffect(() => {
        if (cvv.length > 0) {
            const length = cardType === 'american-express' ? 4 : CvvLength;
            const result = valid.cvv(cvv, length);
            setErrors((prev) => ({
                ...prev,
                cvv: result.isValid ? '' : 'Invalid CVV',
            }));
        }
    }, [cvv, cardType]);

    return (
        <View style={styles.card}>
            {cardType && (
                <Image
                    source={{ uri: `${CartTypeImageBaseURL}/${cardType.replace('-', '_')}.svg` }}
                    style={styles.cardLogo}
                />
            )}
            <Text style={styles.label}>CARD NUMBER</Text>
            <TextInput
                style={styles.input}
                value={formatCardNumber(cardNumber, getCardMaxLength())}
                keyboardType="numeric"
                onChangeText={(text) =>
                    setCardNumber(text.replace(/\D/g, '').slice(0, getCardMaxLength()))
                }
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#aaa"
            />
            {errors.cardNumber !== '' && <Text style={styles.error}>{errors.cardNumber}</Text>}

            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.label}>MM/YY</Text>
                    <TextInput
                        style={styles.input}
                        value={expiry}
                        keyboardType="numeric"
                        maxLength={ExpLength}
                        placeholder="11/24"
                        placeholderTextColor="#aaa"
                        onChangeText={(text) => {
                            const sanitized = text.replace(/\D/g, '');
                            if (sanitized.length <= 4) {
                                const formatted = sanitized.replace(/(\d{2})(\d{0,2})/, (_, m, y) => `${m}/${y}`);
                                setExpiry(formatted);
                            }
                        }}
                    />
                    {errors.expiry !== '' && <Text style={styles.error}>{errors.expiry}</Text>}
                </View>
                <View style={styles.column}>
                    <Text style={styles.label}>CVV2/CVC2</Text>
                    <TextInput
                        style={styles.input}
                        value={cvv}
                        keyboardType="numeric"
                        maxLength={cardType === 'american-express' ? 4 : CvvLength}
                        secureTextEntry
                        placeholder="***"
                        placeholderTextColor="#aaa"
                        onChangeText={setCvv}
                    />
                    {errors.cvv !== '' && <Text style={styles.error}>{errors.cvv}</Text>}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#2D2E30',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    label: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 4,
    },
    input: {
        color: '#fff',
        fontSize: 20,
        borderBottomColor: '#555',
        borderBottomWidth: 1,
        paddingBottom: 6,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        width: '48%',
    },
    cardLogo: {
        width: 60,
        height: 40,
        resizeMode: 'contain',
        position: 'absolute',
        top: 20,
        right: 20,
    },
    error: {
        color: '#FF6B6B',
        fontSize: 11,
        marginBottom: 6,
    },
});

