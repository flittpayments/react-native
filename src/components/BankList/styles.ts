import {StyleSheet} from "react-native";

// Default styles that can be overridden by parent components
export const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 10,
    },
    listContent: {
        paddingHorizontal: 10,
    },
    bankItem: {
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 8,
        width: 100,
    },
    bankLogoContainer: {
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    bankLogo: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    bankName: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        color: '#888',
    },
    bankInfo: {
        alignItems: 'center',
        width: '100%',
    },
    countryText: {
        fontSize: 12,
        color: '#666666',
        marginTop: 4,
    },
    quickMethodTag: {
        backgroundColor: '#E1F5FE',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        marginRight: 8,
    },
    popularTag: {
        backgroundColor: '#FFF9C4',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    tagText: {
        fontSize: 12,
        color: '#424242',
    },
});
