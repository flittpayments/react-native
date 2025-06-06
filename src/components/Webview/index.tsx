import React, {
    useRef,
    useState,
    useCallback,
    useImperativeHandle,
    forwardRef,
} from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';
import { Native } from '../../Native';
import {IOrderData} from "../../manager/types";
import {urlStartPattern} from "../../helpers/constants";
import {FlittWebviewPrivate, FlittWebViewState} from "./types";

const addViewportMeta = `(${String(() => {
    // @ts-ignore
    const meta = document.createElement('meta');
    meta.setAttribute('content', 'width=device-width, user-scalable=0,');
    meta.setAttribute('name', 'viewport');
    // @ts-ignore
    const elementHead = document.getElementsByTagName('head');
    if (elementHead) {
        elementHead[0].appendChild(meta);
    } else {
        // @ts-ignore
        const head = document.createElement('head');
        head.appendChild(meta);
    }
})})();`;

export const flittWebViewRef = React.createRef<FlittWebviewPrivate>();

export const FlittWebView = forwardRef<FlittWebviewPrivate>((_, ref) => {
    const [state, setState] = useState<FlittWebViewState>({
        baseUrl: undefined,
    });

    const webViewRef = useRef<WebView>(null);
    const onSuccessRef = useRef<(receipt: IOrderData) => void>();
    const onFailureRef = useRef<() => void>();

    const __confirm__ = useCallback(
        (
            baseUrl: string,
            html: string,
            cookies: string | null,
            apiHost: string,
            callbackUrl: string
        ): Promise<IOrderData> => {
            if (onSuccessRef.current) {
                throw new Error('FlittWebView already waiting for confirmation');
            }

            if (cookies && Platform.OS === 'android') {
                Native.addCookies(baseUrl, cookies);
            }

            setState({ baseUrl, html, cookies, apiHost, callbackUrl });

            return new Promise((resolve, reject) => {
                onSuccessRef.current = resolve;
                onFailureRef.current = reject;
            });
        },
        []
    );

    useImperativeHandle(ref, () => ({
        __confirm__,
    }));

    const handleLoadStart = useCallback(
        (event: WebViewNavigationEvent) => {
            if (!onSuccessRef.current || !state.baseUrl) return;

            const { url } = event.nativeEvent;
            const { apiHost, callbackUrl } = state;

            const detectsStartPattern = url.startsWith(urlStartPattern);
            const detectsCallbackUrl = url.startsWith(callbackUrl);
            const detectsApiToken = url.startsWith(`${apiHost}/api/checkout?token=`);

            if (detectsStartPattern || detectsCallbackUrl || detectsApiToken) {
                let receipt: IOrderData | undefined = undefined;
                if (detectsStartPattern) {
                    const jsonPart = url.split(urlStartPattern)[1];
                    let response;
                    try {
                        response = JSON.parse(jsonPart);
                    } catch (e) {
                        response = JSON.parse(decodeURIComponent(jsonPart));
                    }
                    receipt = response.params;
                }

                setState({ baseUrl: undefined });

                if (receipt) {
                    onSuccessRef.current?.(receipt);
                    onSuccessRef.current = undefined;
                }

                webViewRef.current?.goBack();
            }
        },
        [state]
    );

    if (state.baseUrl === undefined) {
        return <View />;
    }

    return (
        <WebView
            ref={webViewRef}
            style={{ flex: 1 }}
            javaScriptEnabled
            domStorageEnabled
            scalesPageToFit
            source={{ baseUrl: state.baseUrl, html: state.html }}
            injectedJavaScript={addViewportMeta}
            onLoadStart={handleLoadStart}
        />
    );
});

