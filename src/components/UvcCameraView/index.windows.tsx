import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type Props = {
  style?: any;
};

const UvcCameraView = (props: Props) => {
  return (
    <View style={[styles.wrapper, props.style]}>
      <Text style={styles.text}>UVC camera is disabled on Windows build</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default UvcCameraView;