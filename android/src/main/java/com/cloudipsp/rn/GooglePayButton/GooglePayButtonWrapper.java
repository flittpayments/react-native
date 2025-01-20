package com.cloudipsp.rn;

import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.gms.wallet.button.ButtonConstants;
import com.google.android.gms.wallet.button.ButtonOptions;
import com.google.android.gms.wallet.button.PayButton;

public class GooglePayButtonWrapper extends FrameLayout {

    private static final String TAG = "GooglePayButtonWrapper";

    private ReadableArray allowedPaymentMethods;
    private int buttonType = ButtonConstants.ButtonType.BUY;
    private int buttonTheme = ButtonConstants.ButtonTheme.DARK;
    private int cornerRadius = 0;
    private PayButton payButton;

    public GooglePayButtonWrapper(ReactContext context) {
        super(context);
    }

    public void addButton() {
        if (payButton != null) {
            removeView(payButton);
        }
        payButton = initializeGooglePayButton();
        addView(payButton);
        getViewTreeObserver().addOnGlobalLayoutListener(this::requestLayout);
    }

     private PayButton initializeGooglePayButton() {
        PayButton googlePayButton = new PayButton(getContext());

         try {
            ButtonOptions.Builder builder = ButtonOptions.newBuilder()
                   .setButtonType(buttonType)
                   .setButtonTheme(buttonTheme)
                   .setCornerRadius((int) PixelUtil.toPixelFromDIP(cornerRadius));

            if (allowedPaymentMethods != null) {
                builder.setAllowedPaymentMethods(allowedPaymentMethods.toString());
            }

            ButtonOptions options = builder.build();

            googlePayButton.initialize(options);

            googlePayButton.setOnClickListener(v -> {
                ReactContext reactContext = (ReactContext) getContext();
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        getId(),
                        "onPress",
                        null
                );
            });

         } catch (Exception e) {
            Log.e(TAG, "Error initializing Google Pay Button: " + e.getMessage(), e);
         }
         return googlePayButton;
     }

    @Override
    public void requestLayout() {
        super.requestLayout();
        post(mLayoutRunnable);
    }

    private final Runnable mLayoutRunnable = () -> {
        measure(
                MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY)
        );
        layout(getLeft(), getTop(), getRight(), getBottom());
    };

    public void setAllowedPaymentMethods(ReadableArray allowedPaymentMethods) {
        this.allowedPaymentMethods = allowedPaymentMethods;
    }

public void setButtonType(String type) {
    switch (type.toLowerCase()) {
        case "book":
            this.buttonType = ButtonConstants.ButtonType.BOOK;
            break;
        case "buy":
            this.buttonType = ButtonConstants.ButtonType.BUY;
            break;
        case "checkout":
            this.buttonType = ButtonConstants.ButtonType.CHECKOUT;
            break;
        case "donate":
            this.buttonType = ButtonConstants.ButtonType.DONATE;
            break;
        case "order":
            this.buttonType = ButtonConstants.ButtonType.ORDER;
            break;
        case "pay":
            this.buttonType = ButtonConstants.ButtonType.PAY;
            break;
        case "plain":
            this.buttonType = ButtonConstants.ButtonType.PLAIN;
            break;
        case "subscribe":
            this.buttonType = ButtonConstants.ButtonType.SUBSCRIBE;
            break;
        default:
            this.buttonType = ButtonConstants.ButtonType.BUY; // Default fallback
            Log.w(TAG, "Unknown button type, defaulting to 'BUY': " + type);
    }
}


    public void setButtonTheme(String theme) {
        this.buttonTheme = "dark".equalsIgnoreCase(theme) ? ButtonConstants.ButtonTheme.DARK : ButtonConstants.ButtonTheme.LIGHT;
    }

    public void setCornerRadius(int radius) {
        this.cornerRadius = radius;
    }
}
