import {RemoteControlModule} from 'services/native-modules';
import {RemoteControlKeys, RemoteControlKeysNative} from 'types/bluetooth';

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

class RemoteControl {
  private static _instance: RemoteControl;
  private _keyEvents: {[key: string]: Function | null} = {};
  private _registeredToNative = false;

  private constructor() {
    this.initializeKeySlots();
    this.ensureNativeListener();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private initializeKeySlots = () => {
    const enumKeys = Object.keys(RemoteControlKeys);
    const enumValues = Object.values(RemoteControlKeys);

    [...enumKeys, ...enumValues].forEach(key => {
      const normalizedKey = this.normalizeKeyCode(key);

      if (!(String(key) in this._keyEvents)) {
        this._keyEvents[String(key)] = null;
      }

      if (!(normalizedKey in this._keyEvents)) {
        this._keyEvents[normalizedKey] = null;
      }
    });
  };

  private ensureNativeListener = () => {
    if (this._registeredToNative) {
      logRemoteFlow('JS RemoteControl ensureNativeListener skipped: already registered');
      return;
    }

    logRemoteFlow('JS RemoteControl registering native listener');
    RemoteControlModule.registerRemoteControlListener(this.onRemoteEvent);
    this._registeredToNative = true;
  };

  private normalizeKeyCode = (rawKeyCode: any): string => {
    const raw = String(rawKeyCode ?? '')
      .trim()
      .toUpperCase()
      .replace(/[\s\-]+/g, '_');

    const aliasMap: {[key: string]: string} = {
      '19': 'UP',
      '20': 'DOWN',
      '21': 'LEFT',
      '22': 'RIGHT',
      '24': 'EXTENSION',
      '25': 'TIMER',
      '29': 'START',
      '30': 'WARM_UP',
      '31': 'STOP',
      '32': 'BREAK',
      '23': 'NEW_GAME',
      '66': 'NEW_GAME',
      '160': 'NEW_GAME',
      '67': 'STOP',
      '82': 'BREAK',
      '85': 'START',
      '126': 'START',
      '127': 'START',
      '86': 'STOP',
      '87': 'BREAK',
      '90': 'BREAK',
      '88': 'WARM_UP',
      '89': 'WARM_UP',
      LEFT: 'LEFT',
      DPAD_LEFT: 'LEFT',
      ARROW_LEFT: 'LEFT',
      RIGHT: 'RIGHT',
      DPAD_RIGHT: 'RIGHT',
      ARROW_RIGHT: 'RIGHT',
      UP: 'UP',
      DPAD_UP: 'UP',
      ARROW_UP: 'UP',
      DOWN: 'DOWN',
      DPAD_DOWN: 'DOWN',
      ARROW_DOWN: 'DOWN',
      START: 'START',
      PLAY: 'START',
      PLAY_PAUSE: 'START',
      MEDIA_PLAY: 'START',
      MEDIA_PLAY_PAUSE: 'START',
      MEDIA_PAUSE: 'START',
      STOP: 'STOP',
      MEDIA_STOP: 'STOP',
      BREAK: 'BREAK',
      MEDIA_NEXT: 'BREAK',
      MEDIA_FAST_FORWARD: 'BREAK',
      WARM: 'WARM_UP',
      WARMUP: 'WARM_UP',
      WARM_UP: 'WARM_UP',
      MEDIA_PREVIOUS: 'WARM_UP',
      MEDIA_REWIND: 'WARM_UP',
      TIMER: 'TIMER',
      TIME: 'TIMER',
      CLOCK: 'TIMER',
      EXTENSION: 'EXTENSION',
      EXTRA_TIME: 'EXTENSION',
      ADD_TIME: 'EXTENSION',
      NEWGAME: 'NEW_GAME',
      NEW_GAME: 'NEW_GAME',
      RESET: 'NEW_GAME',
      RESTART: 'NEW_GAME',
      ENTER: 'NEW_GAME',
      OK: 'NEW_GAME',
      DPAD_CENTER: 'NEW_GAME',
      CENTER: 'NEW_GAME',
    };

    return aliasMap[raw] ?? raw;
  };

  private isKeyUpEvent = (data: RemoteControlKeysNative) => {
    const action = String((data as any)?.action ?? (data as any)?.keyAction ?? '')
      .trim()
      .toLowerCase();

    return (
      action === '1' ||
      action === 'up' ||
      action === 'keyup' ||
      action === 'key_up' ||
      action === 'action_up'
    );
  };

  private onRemoteEvent = (data: RemoteControlKeysNative) => {
    const eventName = String((data as any)?.__eventName ?? 'unknown');
    const isKeyUp = this.isKeyUpEvent(data);
    const repeatCount = Number((data as any)?.repeatCount ?? 0);
    const rawKeyCode = (data as any)?.keyCode;
    const rawScanCode = (data as any)?.scanCode;
    const rawResolvedKey =
      (data as any)?.key ??
      (data as any)?.resolvedKey ??
      (data as any)?.code;

    const preferredPhysicalCode = rawKeyCode ?? rawScanCode ?? rawResolvedKey;
    const normalizedFromCode = this.normalizeKeyCode(preferredPhysicalCode);
    const normalizedFromResolved = this.normalizeKeyCode(rawResolvedKey);

    logRemoteFlow('JS RemoteControl onRemoteEvent', {
      eventName,
      rawKeyCode,
      rawScanCode,
      action: (data as any)?.action,
      repeatCount,
      rawResolvedKey,
      normalizedFromCode,
      normalizedFromResolved,
      isKeyUp,
    });

    if (isKeyUp) {
      logRemoteFlow('JS RemoteControl ignored key up event', {
        eventName,
        rawKeyCode,
        normalizedFromCode,
      });
      return;
    }

    if (repeatCount > 0) {
      logRemoteFlow('JS RemoteControl ignored repeat event', {
        eventName,
        rawKeyCode,
        repeatCount,
      });
      return;
    }

    const callback =
      this._keyEvents[normalizedFromCode] ??
      this._keyEvents[String(preferredPhysicalCode)] ??
      this._keyEvents[normalizedFromResolved] ??
      this._keyEvents[String(rawResolvedKey)] ??
      null;

    if (typeof callback !== 'function') {
      logRemoteFlow('JS RemoteControl no callback mapped', {
        eventName,
        rawKeyCode,
        rawScanCode,
        rawResolvedKey,
        normalizedFromCode,
        normalizedFromResolved,
        registeredKeys: Object.keys(this._keyEvents).filter(
          key => typeof this._keyEvents[key] === 'function',
        ),
      });
      return;
    }

    logRemoteFlow('JS RemoteControl invoking callback', {
      eventName,
      rawKeyCode,
      normalizedFromCode,
      normalizedFromResolved,
    });
    callback();
  };

  public registerKeyEvents = (
    event: RemoteControlKeys | string,
    callback: Function,
  ) => {
    this.ensureNativeListener();
    this.initializeKeySlots();

    const rawEvent = String(event);
    const normalizedEvent = this.normalizeKeyCode(event);

    this._keyEvents[rawEvent] = callback;
    this._keyEvents[normalizedEvent] = callback;

    logRemoteFlow('JS RemoteControl registerKeyEvents', {
      rawEvent,
      normalizedEvent,
    });
  };

  public registerKeyEvent = (
    event: RemoteControlKeys | string,
    callback: Function,
  ) => {
    this.registerKeyEvents(event, callback);
  };

  public clearKeyEvent = (event: RemoteControlKeys | string) => {
    const rawEvent = String(event);
    const normalizedEvent = this.normalizeKeyCode(event);

    this._keyEvents[rawEvent] = null;
    this._keyEvents[normalizedEvent] = null;

    logRemoteFlow('JS RemoteControl clearKeyEvent', {
      rawEvent,
      normalizedEvent,
    });
  };

  public unregisterKeyEvents = (event: RemoteControlKeys | string) => {
    this.clearKeyEvent(event);
  };

  public clearAllKeyEvents = () => {
    Object.keys(this._keyEvents).forEach(key => {
      this._keyEvents[key] = null;
    });
    logRemoteFlow('JS RemoteControl clearAllKeyEvents');
  };

  public removeAllListeners = () => {
    this.clearAllKeyEvents();
    RemoteControlModule.removeAllRemoteControlListeners();
    this._registeredToNative = false;
    logRemoteFlow('JS RemoteControl removeAllListeners');
  };
}

export default RemoteControl;
