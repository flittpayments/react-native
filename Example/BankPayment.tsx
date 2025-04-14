import React, {useEffect, useState} from 'react';
import {
    View,
    SafeAreaView,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    FlatList
} from 'react-native';
import { Bank,Cloudipsp } from '@flittpayments/react-native-flitt';

const PayWithBank = () => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);


    const cloudipsp = new Cloudipsp(1549901);

    useEffect(() => {
        const loadBanks = async() => {
            try {
                setLoading(true);
                const bankList = await cloudipsp.getAvailableBanks({token: "9c27149ae8b649e80c4b95c1af694747c36bef3c"});
                setBanks(bankList);
            } catch (error) {
                console.error("Failed to load banks:", error);
            } finally {
                setLoading(false);
            }
        };

        loadBanks();
    }, []);

    const handleBankSelection = async (bank: Bank) => {
        try {
            setSelectedBank(bank);
            setProcessing(true);

            await cloudipsp.initiateBankPayment({
                token: "9c27149ae8b649e80c4b95c1af694747c36bef3c",
                bank: bank,
                callback: {
                    onPaidSuccess: (response) => {
                        console.log("Payment successful", response);
                        // Handle successful payment
                        setProcessing(false);
                    },
                    onPaidFailure: (error) => {
                        console.error("Payment failed", error);
                        // Handle failed payment
                        setProcessing(false);
                    }
                },
                autoRedirect: true
            });
        } catch (error) {
            console.error("Error processing payment:", error);
            setProcessing(false);
        }
    };

    const renderBankItem = ({ item }: { item: Bank }) => (
        <TouchableOpacity
            style={[
                styles.bankItem,
                selectedBank?.getBankId() === item.getBankId() && styles.selectedBankItem
            ]}
            onPress={() => handleBankSelection(item)}
            disabled={processing}
        >
            <View style={styles.bankContent}>
                {item.getBankLogo() ? (
                    <Image
                        source={{ uri: `https://pay.flitt.com/icons/dist/png/128/banks/${item.getBankLogo()}.png` }}
                        style={styles.bankLogo}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={styles.placeholderLogo}>
                        <Text style={styles.placeholderText}>{item.getName().substring(0, 2).toUpperCase()}</Text>
                    </View>
                )}
                <View style={styles.bankDetails}>
                    <Text style={styles.bankName}>{item.getName()}</Text>
                    <Text style={styles.bankCountry}>{item.getCountry()}</Text>
                    {item.isQuickMethod() && (
                        <View style={styles.quickMethodBadge}>
                            <Text style={styles.quickMethodText}>Fast</Text>
                        </View>
                    )}
                </View>
            </View>
            {item.isUserPopular() && (
                <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Popular</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Select Payment Method</Text>
            </View>

            <View style={styles.content}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0366d6" />
                        <Text style={styles.loadingText}>Loading available banks...</Text>
                    </View>
                ) : banks.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No banks available for payment</Text>
                    </View>
                ) : (
                    <FlatList
                        data={banks}
                        renderItem={renderBankItem}
                        keyExtractor={(item) => item.getBankId()}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>

            {processing && (
                <View style={styles.processingOverlay}>
                    <View style={styles.processingContent}>
                        <ActivityIndicator size="large" color="#FFFFFF" />
                        <Text style={styles.processingText}>Processing payment...</Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f7',
    },
    header: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
    },
    listContent: {
        padding: 16,
    },
    bankItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    selectedBankItem: {
        borderWidth: 2,
        borderColor: '#0366d6',
    },
    bankContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    bankLogo: {
        width: 40,
        height: 40,
        borderRadius: 6,
    },
    placeholderLogo: {
        width: 40,
        height: 40,
        borderRadius: 6,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666666',
    },
    bankDetails: {
        marginLeft: 12,
        flex: 1,
    },
    bankName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333333',
    },
    bankCountry: {
        fontSize: 14,
        color: '#666666',
        marginTop: 2,
    },
    quickMethodBadge: {
        backgroundColor: '#e6f7ff',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 6,
        alignSelf: 'flex-start',
    },
    quickMethodText: {
        fontSize: 12,
        color: '#0366d6',
        fontWeight: '500',
    },
    popularBadge: {
        backgroundColor: '#fff1e6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    popularText: {
        fontSize: 12,
        color: '#f56a00',
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 8,
    },
    processingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    processingContent: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
    },
    processingText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginTop: 16,
        fontWeight: '500',
    }
});

export default PayWithBank;
