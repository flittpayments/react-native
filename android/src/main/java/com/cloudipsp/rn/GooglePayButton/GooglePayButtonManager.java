package com.cloudipsp.rn;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import com.facebook.react.common.MapBuilder;
import java.util.Map;

public class GooglePayButtonManager extends SimpleViewManager<GooglePayButtonWrapper> {

    private static final String REACT_CLASS = "GooglePayButton";

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected void onAfterUpdateTransaction(GooglePayButtonWrapper view) {
        super.onAfterUpdateTransaction(view);
        view.addButton();
    }

    @NonNull
    @Override
    protected GooglePayButtonWrapper createViewInstance(@NonNull ThemedReactContext context) {
        return new GooglePayButtonWrapper(context);
    }

    @ReactProp(name = "allowedPaymentMethods")
    public void setAllowedPaymentMethods(GooglePayButtonWrapper view, ReadableArray allowedPaymentMethods) {
        view.setAllowedPaymentMethods(allowedPaymentMethods);
    }

    @ReactProp(name = "type")
    public void setType(GooglePayButtonWrapper view, String type) {
        view.setButtonType(type);
    }

    @ReactProp(name = "theme")
    public void setTheme(GooglePayButtonWrapper view, String theme) {
        view.setButtonTheme(theme);
    }

    @ReactProp(name = "borderRadius")
    public void setCornerRadius(GooglePayButtonWrapper view, int radius) {
        view.setCornerRadius(radius);
    }

    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
                "onPress", MapBuilder.of("registrationName", "onPress")
        );
    }
}
