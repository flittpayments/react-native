import React, {useEffect, useState} from 'react';
import {FlatList, View, Text, Image, TouchableOpacity, Linking} from "react-native";
import {FlittBankIcons} from "../../helpers/constants";
import {useFlitt} from "../Flitt";
import {styles} from "./styles";
import {IBankListProps} from "./types";
import {IBank} from "../../manager/bank/types";


export const BankList: React.FC<IBankListProps> = ({
                                                       token,
                                                       order,
                                                       containerStyle,
                                                       listContentStyle,
                                                       itemStyle,
                                                       textStyle,
                                                       imageStyle,
                                                       logoContainerStyle,
                                                       showCountry,
                                                       countryTextStyle,
                                                       onSuccess,
                                                       onError,
                                                       onStart,
                                                       autoRedirect = true
                                                   }) => {
    const [state, setState] = useState<IBank[]>([]);
    const {getAvailableBanks, initiateBankPayment, merchantId} = useFlitt();


    useEffect(() => {
        const initializeBanks = async () => {
            try {
                const response = await getAvailableBanks({
                    token,
                    order,
                });
                setState(response);
            } catch (error) {
                console.error("Error fetching bank list:", error);
            }
        }
        initializeBanks();
    }, [token, order, getAvailableBanks]);

    const renderItem = ({item}: { item: IBank }) => (
        <TouchableOpacity
            style={[styles.bankItem, itemStyle]}
            onPress={async () => {
                if (order) {
                    await initiateBankPayment({
                            order,
                            merchantId,
                            bankId: +item.id,
                            onStart: onStart,
                            onSuccess: (response) => {
                                onSuccess?.(response)
                                if(autoRedirect && response.url) {
                                    Linking.openURL(response.url)
                                }
                            },
                            onError: onError
                        }
                    )

                    return
                }
                await initiateBankPayment({
                    token,
                    merchantId,
                    bankId: +item.id,
                    onStart: onStart,
                    onSuccess: (response) => {
                        onSuccess?.(response)
                        Linking.openURL(response.url)
                    },
                    onError: onError
                })
            }}
        >
            <View style={[styles.bankLogoContainer, logoContainerStyle]}>
                {item.bank_logo && (
                    <Image
                        source={{uri: `${FlittBankIcons}${item.bank_logo}.png`}}
                        style={[styles.bankLogo, imageStyle]}
                    />
                )}
            </View>
            <View style={styles.bankInfo}>
                <Text style={[styles.bankName, textStyle]}>{item.name}</Text>
                {showCountry && item.country && (
                    <Text style={[styles.countryText, countryTextStyle]}>{item.country}</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    if (!state) {
        return null;
    }

    return (
        <View style={[styles.container, containerStyle]}>
            {state.length > 0 && (
                <FlatList
                    data={state}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.name || item.alias || Math.random().toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    contentContainerStyle={[styles.listContent, listContentStyle]}
                />
            )}
        </View>
    );
};
