# React Native Flitt Payment Integration

This README provides comprehensive guidance for integrating Flitt payment functionality into your React Native application, including Google Pay, Apple Pay, and standard card payment options.

## Installation

```bash
npm install @flittpayments/react-native-flitt --save
# or
yarn add @flittpayments/react-native-flitt
```

## Android Setup

### 1. settings.gradle

Add the following to your project's settings.gradle file:

```gradle
include ':flittpayments_react-native-flitt'
project(':flittpayments_react-native-flitt').projectDir = new File(rootProject.projectDir, '../node_modules/@flittpayments/react-native-flitt/android')
```

### 2. App/build.gradle

Add the following dependencies to your app's build.gradle file:

```gradle
dependencies {
    implementation project(':flittpayments_react-native-flitt')
    // Important: This specific version is required for GooglePayButton to work correctly
    implementation 'com.google.android.gms:play-services-wallet:19.4.0'
}
```

### 3. MainApplication.java

Register the package in your MainApplication.java file:

```java
@Override
protected List<ReactPackage> getPackages() {
    @SuppressWarnings("UnnecessaryLocalVariable")
    List<ReactPackage> packages = new PackageList(this).getPackages();
    packages.add(new RNFlittPackage());
    return packages;
}
```

### 4. AndroidManifest.xml

Add the required permissions to your AndroidManifest.xml:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<application ... >
<meta-data
android:name="com.google.android.gms.wallet.api.enabled"
android:value="true" />
        </application>
```

## iOS Setup

### 1. Register as an Apple Developer

To implement Apple Pay, you need to:

Create a Merchant ID:
- Go to Certificates, Identifiers & Profiles
- Select Identifiers and click the + button
- Choose "Merchant IDs"
- Enter a description and identifier (e.g., merchant.com.yourcompany.app)
- Register the Merchant ID

### 2. Configure Apple Pay in Xcode

1. In Xcode, select your project
2. Go to the "Signing & Capabilities" tab
3. Click "+ Capability" and add "Apple Pay"
4. Add your Merchant ID to the Apple Pay section
5. Configure your payment processing certificate in the Apple Developer portal

### 3. Update Info.plist

Add the following to your Info.plist:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

## Basic Usage

### Importing Components

All components should be imported from the package:

```javascript
import {
    Card,
    CardFieldCvv,
    CardFieldExpMm,
    CardFieldExpYy,
    CardFieldNumber,
    CardInput,
    CardLayout,
    Cloudipsp,
    CloudipspWebView,
    Order,
    GooglePayButton
} from '@flittpayments/react-native-flitt';
```

For TypeScript users, the types can be imported directly from the package as well:

```typescript
import {
    Card,
    CardFieldCvv,
    CardFieldExpMm,
    CardFieldExpYy,
    CardFieldNumber,
    CardInput,
    CardLayout,
    Cloudipsp,
    CloudipspWebView,
    Order,
    GooglePayButton,
    Receipt,
    IOrder
} from '@flittpayments/react-native-flitt';
```

### Creating a WebView Reference

```javascript
const _cloudipspWebView = React.createRef<CloudipspWebView>();
```

### Setting up a Cloudipsp Instance

```javascript
const _cloudipsp = (): Cloudipsp => {
    return new Cloudipsp(Number(merchantId), (payConfirmator) => {
        setWebView(1); // Set state to show WebView
        return payConfirmator(_cloudipspWebView.current!);
    });
};
```

### Creating an Order

```javascript
const _getOrder = () => {
    return new Order(
        Number(amount),  // Amount
        currency,        // Currency code
        'order_' + Math.random(), // Unique order ID
        description,     // Description
        email            // Customer email
    );
};
```

## Payment Methods Implementation

### 1. Google Pay Button Component

Use the pre-built Google Pay Button component:

```jsx
<GooglePayButton
    borderRadius={10}
    type={'pay'}
    theme={'dark'}
    style={{ width: '100%', height: 60 }}
    onStart={() => console.log('pressed')}
    order={{
        amount: 10,
        currency: 'GEL',
        orderId: 'rn_' + Math.random(),
        description: 'test payment',
        email: 'test@gmail.com'
    }} // OR token={{ token }}
    merchant_id={merchantId}
    webView={_cloudipspWebView}
    setWebView={() => setWebView(1)}
    onSuccess={(receipt) => {
        console.log('paymentSuccess: ', receipt)
        setWebView(0)
    }}
    onError={(error) => {
        console.log(error)
        setWebView(0)
    }}
/>
```

GooglePayButton Props:
- `theme?: 'dark' | 'light'`
- `type?: ButtonType`
- `borderRadius?: number`
- `style?: StyleProp<ViewStyle>`
- `merchant_id: number`
- `webView?: React.RefObject<CloudipspWebView>`
- `setWebView?: () => void`
- `onSuccess?: (receipt: Receipt) => void`
- `onError?: (error: any) => void`
- `onStart?: () => void`
- `order?: IOrder` (required if token not provided)
- `token?: string` (required if order not provided)

### 2. Custom Google Pay Implementation

```javascript
const handleGooglePay = async () => {
    try {
        const order = new Order(
            100,                // Amount
            'GEL',              // Currency
            'order_' + Math.random(), // Unique order ID
            'test payment',     // Description
            'test@gmail.com'    // Customer email
        );
        const cloudipsp = _cloudipsp();
        const result = await cloudipsp.googlePay(order);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};

// Use with a custom button
<Button title="Google Pay Custom Button" onPress={() => handleGooglePay()} />
```

### 3. Google Pay with Token

```javascript
const handleGooglePayToken = async () => {
    try {
        const order = new Order(
            100,                // Amount
            'GEL',              // Currency
            'order_' + Math.random(), // Unique order ID
            'test payment',     // Description
            'test@gmail.com'    // Customer email
        );
        const cloudipsp = _cloudipsp();
        const result = await cloudipsp.googlePayToken('3b48e3cd87ca36856fb3dba5e7b14fa4c0372762');
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};
```

### 4. Apple Pay Implementation

```javascript
const handleApplePayPress = async () => {
    const cloudipsp = _cloudipsp();
    const order = new Order(
        10,                 // Amount
        'GEL',              // Currency
        'rn_' + Math.random(), // Unique order ID
        'test payment',     // Description
        'test@gmail.com'    // Customer email
    );

    try {
        // Process the Apple Pay transaction and return the receipt
        const receipt = await cloudipsp.applePay(order);
        console.log('Payment successful:', receipt);
    } catch (error) {
        // Handle payment errors
        console.error('Payment error:', error);
    }
};

// Use with a button
<Button title="Apple Pay" onPress={() => handleApplePayPress()} />
```

### 5. Apple Pay with Token

```javascript
const handleApplePayToken = async () => {
    try {
        const cloudipsp = _cloudipsp();
        const result = await cloudipsp.applePayToken('3b48e3cd87ca36856fb3dba5e7b14fa4c0372762');
        console.log('Payment successful:', result);
    } catch (error) {
        console.error('Payment error:', error);
    }
};
```

### 6. Standard Card Payment

```javascript
const handleCardPayment = () => {
    let card = cardInputRef.current?.getCard() ?? null;
    const order = _getOrder();

    if (!card || !card.isValidCardNumber()) {
        Alert.alert('Warning', 'Credit card number is not valid');
    } else if (!card.isValidExpireMonth()) {
        Alert.alert('Warning', 'Expire month is not valid');
    } else if (!card.isValidExpireYear()) {
        Alert.alert('Warning', 'Expire year is not valid');
    } else if (!card.isValidExpireDate()) {
        Alert.alert('Warning', 'Expire date is not valid');
    } else if (!card.isValidCvv()) {
        Alert.alert('Warning', 'CVV is not valid');
    } else {
        const cloudipsp = _cloudipsp();
        cloudipsp.pay(card, order)
            .then((receipt) => {
                setWebView(undefined);
                Alert.alert('Transaction Completed :)', 'Result: ' + receipt.status + '\nPaymentId: ' + receipt.paymentId);
                console.log('Receipt: ', receipt);
            })
            .catch((error) => {
                console.log('Error: ', error);
            });
    }
};
```

### 7. Bank Payment Implementation

Flitt SDK provides support for bank payments, allowing users to pay directly through their bank accounts. This implementation consists of two main steps: retrieving available banks and initiating a bank payment.

#### Getting Available Banks

You can retrieve the list of available banks for payment using either a token or an order:

```javascript

const cloudipsp = new Cloudipsp(merchantId);

// Using a token
const getAvailableBanksWithToken = async () => {
    try {
        const banks = await cloudipsp.getAvailableBanks({
            token: "your-payment-token"
        });
        console.log('Available banks:', banks);
        return banks;
    } catch (error) {
        console.error('Failed to get available banks:', error);
    }
};

// Using an order
const getAvailableBanksWithOrder = async () => {
    try {
        const order = new Order(
            100,                // Amount
            'GEL',              // Currency
            'order_' + Math.random(), // Unique order ID
            'bank payment',     // Description
            'customer@email.com'    // Customer email
        );
        
        const banks = await cloudipsp.getAvailableBanks({
            order: order
        });
        console.log('Available banks:', banks);
        return banks;
    } catch (error) {
        console.error('Failed to get available banks:', error);
    }
};
```

#### Initiating Bank Payment

After retrieving and selecting a bank, you can initiate the payment:


```javascript
const initiateBankPayment = async (selectedBank) => {
    try {
        
        // You can use either a token or an order
        const response = await cloudipsp.initiateBankPayment({
            // Option 1: Using a token
            token: "your-payment-token",
            
            // Option 2: Using an order
            // order: new Order(100, 'GEL', 'order_id', 'description', 'email'),
            
            // Selected bank from the getAvailableBanks response
            bank: selectedBank,
            
            // Optional: Control whether to automatically redirect to the bank's page
            autoRedirect: true,
            
            // Optional: Callback handlers for payment status
            callback: {
                onPaidSuccess: (response) => {
                    console.log("Payment successful", response);
                    // Handle successful payment
                },
                onPaidFailure: (error) => {
                    console.error("Payment failed", error);
                    // Handle failed payment
                }
            }
        });
        
        return response;
    } catch (error) {
        console.error('Bank payment failed:', error);
        throw error;
    }
};
```

#### Complete Bank Payment Implementation Example

Here's a complete example showing how to implement bank payments in a React component:

```jsx
import React, { useEffect, useState } from 'react';
import {
    View, 
    SafeAreaView,
    Text, 
    FlatList, 
    TouchableOpacity, 
    ActivityIndicator
} from 'react-native';
import { Cloudipsp } from '@flittpayments/react-native-flitt';
import { Bank } from '@flittpayments/react-native-flitt/dist/typescript/models/Bank';

const BankPaymentScreen = () => {
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const cloudipsp = new Cloudipsp(merchantId);
    
    useEffect(() => {
        loadAvailableBanks();
    }, []);
    
    const loadAvailableBanks = async () => {
        try {
            setLoading(true);
            
            // You can use either token or order
            const bankList = await cloudipsp.getAvailableBanks({
                token: "your-payment-token"
                // OR
                // order: yourOrderObject
            });
            
            setBanks(bankList);
        } catch (error) {
            console.error("Failed to load banks:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleBankSelection = async (bank) => {
        try {
            setProcessing(true);
            
            await cloudipsp.initiateBankPayment({
                token: "your-payment-token",
                // OR
                // order: yourOrderObject,
                bank: bank,
                autoRedirect: true,
                callback: {
                    onPaidSuccess: (response) => {
                        console.log("Payment successful", response);
                        setProcessing(false);
                        // Navigate or update UI on success
                    },
                    onPaidFailure: (error) => {
                        console.error("Payment failed", error);
                        setProcessing(false);
                        // Show error message
                    }
                }
            });
        } catch (error) {
            console.error("Error processing payment:", error);
            setProcessing(false);
        }
    };
    
    // Render your bank selection UI...
};
```

## Card Input Components

### Default Card Input

```jsx
<CardInput
    ref={cardInputRef}
    debug={true}
    textStyle={styles.simpleText}
    textInputStyle={styles.simpleTextInput}
/>
```

### Flexible Card Layout

```jsx
<CardLayout
    ref={cardLayoutRef}
    inputNumber={() => inputNumber.current!}
    inputExpMm={() => inputExpMm.current!}
    inputExpYy={() => inputExpYy.current!}
    inputCvv={() => inputCvv.current!}
>
    <Text>Card Number:</Text>
    <CardFieldNumber
        ref={inputNumber}
        style={styles.simpleTextInput}
        onSubmitEditing={() => {
            inputCvv.current?.focus();
        }}
    />
    <Text>CVV:</Text>
    <CardFieldCvv
        ref={inputCvv}
        style={styles.simpleTextInput}
        onSubmitEditing={() => {
            inputExpMm.current?.focus();
        }}
    />
    <Text>Expiry:</Text>
    <View style={{ flexDirection: 'row' }}>
        <CardFieldExpMm
            ref={inputExpMm}
            style={[styles.flex1, styles.simpleTextInput]}
            placeholder='MM'
            onSubmitEditing={() => {
                inputExpYy.current?.focus();
            }}
        />
        <CardFieldExpYy
            ref={inputExpYy}
            style={[styles.flex1, styles.simpleTextInput]}
            placeholder='YY'
        />
    </View>
</CardLayout>
```

## WebView Handling

```jsx
// In your render method
return (
    <SafeAreaView style={styles.flex1}>
        {webView === undefined
            ? renderMainScreen()
            : <CloudipspWebView ref={_cloudipspWebView} />
        }
    </SafeAreaView>
);
```

## Payment Method Support Detection

```javascript
// Check if device supports Apple Pay
Cloudipsp.supportsApplePay()
    .then((result) => {
        console.log('SupportsApplePay: ', result);
    });

// Check if device supports Google Pay
Cloudipsp.supportsGooglePay()
    .then((result) => {
        console.log('SupportsGooglePay: ', result);
    });
```

## Notes

- Make sure to handle the WebView state properly to show/hide it during payment processing.
- Always validate card information before attempting payment.
- Use unique order IDs for each transaction.
- Implement proper error handling for all payment methods.
- For GooglePayButton to work correctly, you must use Google Play Services Wallet version 19.4.0.
