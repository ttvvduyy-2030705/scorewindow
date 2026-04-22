import 'react-native-get-random-values';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View as RNView} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';

import {StackScreens} from 'scenes';
import {LanguageContext} from 'context/language';
import {loadLanguage, setLanguage} from 'i18n';
import {navigationRef} from 'utils/navigation';
import Loading from 'components/Loading';
import storage, {persistor} from 'data/redux';
import RemoteControl from 'utils/remote';

const App = (): React.JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('vi');

  const init = useCallback(async () => {
    try {
      const savedLanguage = await loadLanguage();
      setCurrentLanguage(savedLanguage);
    } catch (error) {
      console.error('[Windows App] init error', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    init();
    return () => {
      RemoteControl.instance.removeAllListeners();
    };
  }, [init]);

  const onChangeCurrentLanguage = useCallback((language: string) => {
    setCurrentLanguage(language);
    setLanguage(language);
  }, []);

  return (
    <RNView style={styles.container}>
      <Provider store={storage}>
        <PersistGate loading={<Loading isLoading={true} />} persistor={persistor}>
          <LanguageContext.Provider
            value={{
              language: currentLanguage,
              onChangeCurrentLanguage,
            }}>
            <NavigationContainer ref={navigationRef}>
              {isLoading ? <Loading isLoading={true} /> : <StackScreens />}
            </NavigationContainer>
          </LanguageContext.Provider>
        </PersistGate>
      </Provider>
    </RNView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
