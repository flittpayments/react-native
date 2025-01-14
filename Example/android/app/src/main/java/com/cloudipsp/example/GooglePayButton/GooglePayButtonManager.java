package com.example;

import android.util.Log;
import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import com.google.android.gms.wallet.PaymentsClient;
import com.google.android.gms.wallet.Wallet;
import com.google.android.gms.wallet.WalletConstants;
import com.google.android.gms.wallet.IsReadyToPayRequest;
import com.google.android.gms.wallet.button.ButtonConstants;
import com.google.android.gms.wallet.button.ButtonOptions;
import com.google.android.gms.wallet.button.PayButton;
import android.widget.FrameLayout;

import com.facebook.react.common.MapBuilder;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

public class GooglePayButtonManager extends SimpleViewManager<GooglePayButtonWrapper> {

    private static final String REACT_CLASS = "GooglePayButton";
    private PaymentsClient paymentsClient;

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    protected GooglePayButtonWrapper createViewInstance(@NonNull ThemedReactContext reactContext) {
        paymentsClient = Wallet.getPaymentsClient(
            reactContext,
            new Wallet.WalletOptions.Builder()
                .setEnvironment(WalletConstants.ENVIRONMENT_TEST)
                .build()
        );

        GooglePayButtonWrapper wrapper = new GooglePayButtonWrapper(reactContext);
        PayButton payButton = wrapper.getPayButton();

        try {
            JSONArray paymentMethods = new JSONArray().put(getBaseCardPaymentMethod());
            payButton.initialize(
                ButtonOptions.newBuilder()
                    .setAllowedPaymentMethods(paymentMethods.toString())
                    .build()
            );

            // Check if Google Pay is ready
            IsReadyToPayRequest request = createIsReadyToPayRequest();
            paymentsClient.isReadyToPay(request).addOnCompleteListener(task -> {
                if (task.isSuccessful() && Boolean.TRUE.equals(task.getResult())) {
                    payButton.setVisibility(View.VISIBLE);
                } else {
                    Log.w("GooglePayButton", "isReadyToPay failed: " +
                            (task.getException() != null ? task.getException().getMessage() : "unknown error"));
                    payButton.setVisibility(View.GONE);
                }
            });

        } catch (Exception e) {
            Log.e("GooglePayButton", "Error initializing PayButton", e);
        }

        return wrapper;
    }

    private IsReadyToPayRequest createIsReadyToPayRequest() {
        try {
            JSONObject request = new JSONObject()
                .put("apiVersion", 2)
                .put("apiVersionMinor", 0)
                .put("allowedPaymentMethods", new JSONArray().put(getBaseCardPaymentMethod()));

            return IsReadyToPayRequest.fromJson(request.toString());
        } catch (Exception e) {
            Log.e("GooglePayButton", "Error creating IsReadyToPayRequest", e);
            return null;
        }
    }

    private JSONObject getBaseCardPaymentMethod() {
        try {
            return new JSONObject()
                .put("type", "CARD")
                .put("parameters", new JSONObject()
                    .put("allowedAuthMethods", new JSONArray().put("PAN_ONLY").put("CRYPTOGRAM_3DS"))
                    .put("allowedCardNetworks", new JSONArray().put("VISA").put("MASTERCARD"))
                );
        } catch (Exception e) {
            Log.e("GooglePayButton", "Error creating base payment method", e);
            return new JSONObject();
        }
    }
    @ReactProp(name = "buttonTheme")
    public void setButtonTheme(GooglePayButtonWrapper wrapper, String theme) {
       wrapper.setButtonTheme(theme);
    }

    @ReactProp(name = "buttonType")
    public void setButtonType(GooglePayButtonWrapper wrapper, String type) {
        wrapper.setButtonType(type);
    }

    @ReactProp(name = "borderRadius")
    public void setCornerRadius(GooglePayButtonWrapper wrapper, int radius) {
        wrapper.setCornerRadius(radius);
    }

    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
                "onClick", MapBuilder.of("registrationName", "onClick")
        );
    }
}
