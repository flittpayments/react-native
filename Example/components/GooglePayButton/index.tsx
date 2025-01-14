import React, {FC} from 'react';
import {requireNativeComponent, StyleSheet} from 'react-native';

// Native component registration
const RNGooglePayButton = requireNativeComponent('GooglePayButton');

interface IGooglePayButton {
    onClick:() => void,
    theme?:'light' | 'dark',
    type?: 'buy' | 'plain',
    borderRadius?:number
}
const GooglePayButton:FC<IGooglePayButton> = ( { onClick,theme = 'light',type = 'buy',borderRadius } ) => (
    <RNGooglePayButton
        style={ styles.button } // required (number | percent)
        onClick={ onClick }
        buttonTheme={ theme } // light
        buttonType={ type } // or plain
        borderRadius={ borderRadius }
    />
);

const styles = StyleSheet.create({
    button: {
        width: '100%', // required (number | percent)
        height: 80
    }
});

export default GooglePayButton;
