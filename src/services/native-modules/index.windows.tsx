import {RemoteControlKeysNative} from 'types/bluetooth';

const noop = () => undefined;

const registerRemoteControlListener = (
  _callback: (data: RemoteControlKeysNative) => void,
) => {
  return noop;
};

const removeAllRemoteControlListeners = () => {
  return undefined;
};

export const RemoteControlModule = {
  registerRemoteControlListener,
  removeAllRemoteControlListeners,
};