package com.example;

import android.content.Context;
import android.view.View;
import android.widget.FrameLayout;
import android.graphics.Color;
import android.view.ViewGroup;

import com.google.android.gms.wallet.button.ButtonConstants;
import com.google.android.gms.wallet.button.ButtonOptions;
import com.google.android.gms.wallet.button.PayButton;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.bridge.ReactContext;


import java.util.Map;
import com.facebook.react.common.MapBuilder;

public class GooglePayButtonWrapper extends FrameLayout {

    private PayButton payButton;
    private int buttonTheme = ButtonConstants.ButtonTheme.LIGHT; // Default: LIGHT
    private int buttonType = ButtonConstants.ButtonType.BUY;      // Default: BUY
    private int cornerRadius = 0;                                 // Default: 0

    public GooglePayButtonWrapper(Context context) {
        super(context);
        initialize(context);
    }

    private void initialize(Context context) {
        payButton = new PayButton(context);

        // Apply the current properties
        updateButtonProperties();

        payButton.setOnClickListener(v -> {
           // Emit event to JavaScript
           ReactContext reactContext = (ReactContext) getContext();
           reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                 getId(),
                 "onClick",
                  null
           );
        });
        addView(payButton);
    }

    public PayButton getPayButton() {
        return payButton;
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        post(measureAndLayout);
    }

    private final Runnable measureAndLayout = () -> {
        payButton.measure(
            MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY)
        );
        payButton.layout(getLeft(), getTop(), getRight(), getBottom());
    };

    public void setButtonTheme(String theme) {
        if ("dark".equalsIgnoreCase(theme)) {
            buttonTheme = ButtonConstants.ButtonTheme.DARK;
        } else if ("light".equalsIgnoreCase(theme)) {
            buttonTheme = ButtonConstants.ButtonTheme.LIGHT;
        } else {
            buttonTheme = ButtonConstants.ButtonTheme.LIGHT; // Default
        }
        updateButtonProperties();
    }

    public void setButtonType(String type) {
        if ("plain".equalsIgnoreCase(type)) {
            buttonType = ButtonConstants.ButtonType.PLAIN;
        } else {
            buttonType = ButtonConstants.ButtonType.BUY; // Default
        }
        updateButtonProperties();
    }

    public void setCornerRadius(int radius) {
        cornerRadius = Math.max(0, radius); // Ensure non-negative
        updateButtonProperties();
    }

    private void updateButtonProperties() {
        ButtonOptions options = ButtonOptions.newBuilder()
            .setButtonTheme(buttonTheme)
            .setButtonType(buttonType)
            .setCornerRadius(cornerRadius)
            .build();

        payButton.initialize(options);
    }
}
