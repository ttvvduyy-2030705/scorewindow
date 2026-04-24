import {NativeModules, NativeEventEmitter} from 'react-native';
import {RemoteControlKeysNative} from 'types/bluetooth';

const REMOTE_FLOW_PREFIX = 'REMOTE_FLOW:';
const logRemoteFlow = (stage: string, payload?: Record<string, any>) => {
  try {
    if (payload) {
      console.log(`${REMOTE_FLOW_PREFIX} ${stage}`, JSON.stringify(payload));
      return;
    }

    console.log(`${REMOTE_FLOW_PREFIX} ${stage}`);
  } catch {
    console.log(`${REMOTE_FLOW_PREFIX} ${stage}`, payload);
  }
};

const RemoteControl =
  NativeModules.RemoteControl ??
  NativeModules.RemoteControlModule ??
  NativeModules.AplusRemoteControl ??
  null;

logRemoteFlow('NativeModules lookup', {
  hasRemoteControl: !!RemoteControl,
  remoteModuleKeys: Object.keys(RemoteControl || {}),
  matchingNativeModules: Object.keys(NativeModules || {}).filter(name =>
    /remote/i.test(String(name)),
  ),
});

const RemoteControlEventEmitter = RemoteControl
  ? new NativeEventEmitter(RemoteControl)
  : null;

const eventNames = ['onRemoteKeyDown', 'onRemoteKeyUp'];

const eventHandlers = eventNames.reduce((result, eventName) => {
  result[eventName] = new Map();
  return result;
}, {} as any);

const addEventListener = (
  type: string,
  handler: (data: RemoteControlKeysNative) => void,
) => {
  const handlers = eventHandlers[type];
  if (!handlers || !RemoteControlEventEmitter) {
    logRemoteFlow('JS addEventListener skipped: native module unavailable', {
      type,
      matchingNativeModules: Object.keys(NativeModules || {}).filter(name =>
        /remote/i.test(String(name)),
      ),
    });
    return;
  }

  if (handlers.has(handler)) {
    logRemoteFlow('JS addEventListener skipped: handler already registered', {
      type,
    });
    return;
  }

  const wrappedHandler = (data: RemoteControlKeysNative) => {
    logRemoteFlow('JS emitter event received', {
      eventName: type,
      keyCode: (data as any)?.keyCode,
      keyCodeInt: (data as any)?.keyCodeInt,
      scanCode: (data as any)?.scanCode,
      action: (data as any)?.action,
      repeatCount: (data as any)?.repeatCount,
    });
    handler({...((data as any) || {}), __eventName: type} as RemoteControlKeysNative);
  };

  handlers.set(handler, RemoteControlEventEmitter.addListener(type, wrappedHandler));
  logRemoteFlow('JS addEventListener registered', {type});
};

const removeAllRemoteControlListeners = () => {
  if (!RemoteControlEventEmitter) {
    logRemoteFlow('JS removeAllRemoteControlListeners skipped: no emitter');
    return;
  }

  for (let i = 0; i < eventNames.length; i++) {
    const eventName = eventNames[i];
    const handlers = eventHandlers[eventName];

    handlers?.forEach((subscription: any) => {
      try {
        subscription?.remove?.();
      } catch {}
    });

    handlers?.clear?.();
    RemoteControlEventEmitter.removeAllListeners(eventName);
    logRemoteFlow('JS removeAllRemoteControlListeners cleared', {eventName});
  }
};

const registerRemoteControlListener = (
  callback: (data: RemoteControlKeysNative) => void,
) => {
  logRemoteFlow('JS registerRemoteControlListener called');
  addEventListener('onRemoteKeyDown', callback);
  addEventListener('onRemoteKeyUp', callback);
};

const setRemoteControlEnabled = (enabled: boolean) => {
  try {
    logRemoteFlow('JS setRemoteControlEnabled', {enabled: !!enabled});
    RemoteControl?.setRemoteControlEnabled?.(!!enabled);
  } catch (error) {
    console.warn('[RemoteControl] failed to set remote enabled state', error);
  }
};

const isRemoteControlEnabled = async (): Promise<boolean> => {
  try {
    const value = await RemoteControl?.isRemoteControlEnabled?.();
    logRemoteFlow('JS isRemoteControlEnabled resolved', {value: !!value});
    return !!value;
  } catch (error) {
    logRemoteFlow('JS isRemoteControlEnabled failed', {
      message: (error as any)?.message,
    });
    return false;
  }
};

export const RemoteControlModule = {
  registerRemoteControlListener,
  removeAllRemoteControlListeners,
  setRemoteControlEnabled,
  isRemoteControlEnabled,
};
