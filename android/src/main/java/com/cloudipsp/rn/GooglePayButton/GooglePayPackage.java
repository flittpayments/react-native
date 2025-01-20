package com.cloudipsp.rn;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.uimanager.ViewManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.cloudipsp.rn.GooglePayButtonManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class GooglePayPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(
        com.facebook.react.bridge.ReactApplicationContext reactContext
    ) {
        return new ArrayList<>();
    }

      @Override
       public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
           return Collections.singletonList(new GooglePayButtonManager());
       }
}
