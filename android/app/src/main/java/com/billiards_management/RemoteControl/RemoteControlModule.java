package com.billiards_management.RemoteControl;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class RemoteControlModule extends ReactContextBaseJavaModule {
    private static final String TAG = "RemoteControlModule";
    private static final String FLOW_TAG = "REMOTE_FLOW";
    private static ReactApplicationContext reactContext;
    private static volatile boolean remoteControlEnabled = false;

    public RemoteControlModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        Log.i(FLOW_TAG, "REMOTE_FLOW: RemoteControlModule constructed hasContext=" + (context != null));
    }

    @NonNull
    @Override
    public String getName() {
        return "RemoteControl";
    }

    @ReactMethod
    public void addListener(String eventName) {
        Log.i(FLOW_TAG, "REMOTE_FLOW: addListener eventName=" + eventName);
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        Log.i(FLOW_TAG, "REMOTE_FLOW: removeListeners count=" + count);
    }

    @ReactMethod
    public void ping() {
        Log.i(FLOW_TAG, "REMOTE_FLOW: ping");
    }

    @ReactMethod
    public void setRemoteControlEnabled(boolean enabled) {
        remoteControlEnabled = enabled;
        Log.i(TAG, "setRemoteControlEnabled=" + enabled);
        Log.i(FLOW_TAG, "REMOTE_FLOW: setRemoteControlEnabled enabled=" + enabled);
    }

    @ReactMethod
    public void isRemoteControlEnabled(Promise promise) {
        Log.i(FLOW_TAG, "REMOTE_FLOW: isRemoteControlEnabled query value=" + remoteControlEnabled);
        promise.resolve(remoteControlEnabled);
    }

    public static boolean isReady() {
        final boolean ready = reactContext != null
                && reactContext.hasActiveReactInstance()
                && reactContext.getCatalystInstance() != null;
        Log.d(FLOW_TAG, "REMOTE_FLOW: isReady ready=" + ready
                + " hasContext=" + (reactContext != null)
                + " hasActiveInstance=" + (reactContext != null && reactContext.hasActiveReactInstance()));
        return ready;
    }

    public static boolean isRemoteControlEnabled() {
        return remoteControlEnabled;
    }

    public static void sendEvent(String eventName, @Nullable WritableMap params) {
        final int action = params != null && params.hasKey("action") ? params.getInt("action") : -1;
        final int keyCodeInt = params != null && params.hasKey("keyCodeInt") ? params.getInt("keyCodeInt") : -1;
        final int scanCode = params != null && params.hasKey("scanCode") ? params.getInt("scanCode") : -1;
        final String keyCode = params != null && params.hasKey("keyCode") ? params.getString("keyCode") : null;
        final int repeatCount = params != null && params.hasKey("repeatCount") ? params.getInt("repeatCount") : -1;

        Log.i(FLOW_TAG, "REMOTE_FLOW: sendEvent requested event=" + eventName
                + " enabled=" + remoteControlEnabled
                + " keyCode=" + keyCode
                + " keyCodeInt=" + keyCodeInt
                + " scanCode=" + scanCode
                + " action=" + action
                + " repeatCount=" + repeatCount);

        if (!remoteControlEnabled) {
            Log.i(FLOW_TAG, "REMOTE_FLOW: sendEvent dropped because remote disabled event=" + eventName);
            return;
        }

        if (!isReady()) {
            Log.w(TAG, "sendEvent skipped: React context not ready. event=" + eventName);
            Log.w(FLOW_TAG, "REMOTE_FLOW: sendEvent skipped because React context not ready event=" + eventName);
            return;
        }

        try {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params != null ? params : Arguments.createMap());
            Log.i(FLOW_TAG, "REMOTE_FLOW: sendEvent emitted to RN event=" + eventName);
        } catch (Exception e) {
            Log.e(TAG, "sendEvent failed for event=" + eventName, e);
            Log.e(FLOW_TAG, "REMOTE_FLOW: sendEvent failed event=" + eventName + " message=" + e.getMessage(), e);
        }
    }
}
