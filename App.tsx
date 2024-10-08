/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-get-random-values';
import React, {useCallback, useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import {logEvent, sendUserId} from 'services/firebase/analytics';
import {LanguageContext} from 'context/language';
import {StackScreens} from 'scenes';
import {navigationRef} from 'utils/navigation';
import storage, {persistor} from 'data/redux';
import {loadLanguage, setLanguage} from 'i18n';
import {RealmProvider} from '@realm/react';
import {GameSchema, GameSettingsModeSchema} from 'data/realm/models/game';
import {PoolBallSchema} from 'data/realm/models/ball';
import {
  PlayerSchema,
  PlayerProModeSchema,
  PlayerSettingsSchema,
  PlayerGoalSchema,
} from 'data/realm/models/player';
import RemoteControl from 'utils/remote';
import {initRemoteConfig} from 'services/firebase/remote-config';
import analyticsKeys from 'services/firebase/analytics/keys';
import DeviceInfo from 'react-native-device-info';
// import {BLEService} from 'utils/bluetooth';

const App = (): React.JSX.Element => {
  const [currentLanguage, setCurrentLanguage] = useState('vi');

  useEffect(() => {
    _init();

    // BLEService.requestBluetoothPermissions();
    // const [
    //   discoverUnsubscribe,
    //   connectUnsubscribe,
    //   didUpdateUnsubscribe,
    //   stopScanUnsubscribe,
    //   disconnectUnsubscribe,
    // ] = BLEService.registerListeners();

    // return () => {
    //   discoverUnsubscribe.remove();
    //   connectUnsubscribe.remove();
    //   didUpdateUnsubscribe.remove();
    //   stopScanUnsubscribe.remove();
    //   disconnectUnsubscribe.remove();
    // };

    return () => {
      RemoteControl.instance.removeAllListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _init = useCallback(async () => {
    const deviceId = await DeviceInfo.getInstanceId();

    sendUserId(deviceId);
    logEvent(analyticsKeys.deviceId, {device_id: deviceId});
    initRemoteConfig();

    const _currentLanguage = await loadLanguage();
    setCurrentLanguage(_currentLanguage);
  }, []);

  const onChangeCurrentLanguage = useCallback((language: string) => {
    setCurrentLanguage(language);
    setLanguage(language);
  }, []);

  return (
    <RealmProvider
      deleteRealmIfMigrationNeeded
      schema={[
        GameSchema,
        GameSettingsModeSchema,
        PlayerSettingsSchema,
        PlayerSchema,
        PlayerProModeSchema,
        PlayerGoalSchema,
        PoolBallSchema,
      ]}>
      <Provider store={storage}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer ref={navigationRef}>
            <LanguageContext.Provider
              value={{language: currentLanguage, onChangeCurrentLanguage}}>
              <StackScreens />
            </LanguageContext.Provider>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </RealmProvider>
  );
};

export default App;
