import React, {useRef, useState} from 'react';
import {View} from 'react-native';
import {CloudipspWebView, GooglePayButton} from 'react-native-cloudipsp';

const Merchant = 1396424;
const GooglePayButton = () => {

    const _cloudipspWebViewRef = useRef<CloudipspWebView>(null);
    const [webView, setWebView] = useState(0);


    // Render the WebView if webView state is true
    if (webView) {
        return <View style={{flex:1,backgroundColor:'green'}}>
            <CloudipspWebView ref={_cloudipspWebViewRef} />
        </View>
    }


    return (
        <GooglePayButton
            borderRadius={ 10 }
            type={'pay'}
            theme={'dark'}
            style={{ width:'100%',height:60 }}
            onStart = {() => console.log('pressed')}
            order = {{
                amount:10,
                currency:'GEL',
                orderId:'rn_' + Math.random(),
                description:'test payment',
                email:'test@gmail.com'
            }}
            merchant_id = { Merchant }
            webView = { _cloudipspWebViewRef }
            setWebView = {() => setWebView(1)}
            onSuccess = {(receipt) => {
                console.log('paymentSuccess: ', receipt)
                setWebView(0)
            }}
            onError = {(error) => {
                console.log(error)
                setWebView(0)
            }}
        />
    )
};

export default GooglePayButton;
