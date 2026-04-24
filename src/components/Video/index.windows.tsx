import React, {forwardRef, memo, useImperativeHandle} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import images from 'assets';

type Props = {
  style?: any;
  source?: any;
  videoUri?: string;
  webcamType?: string;
  isStarted?: boolean;
  isPaused?: boolean;
  isPreview?: boolean;
  setIsCameraReady?: (isReady: boolean) => void;
};

const AplusVideo = (props: Props, ref: React.Ref<unknown>) => {
  useImperativeHandle(ref, () => ({
    startRecording: async () => undefined,
    stopRecording: async () => undefined,
    pauseRecording: async () => undefined,
    resumeRecording: async () => undefined,
    takePhoto: async () => undefined,
  }));

  React.useEffect(() => {
    props.setIsCameraReady?.(false);
  }, [props]);

  return (
    <View style={[styles.wrapper, props.style]}>
      <Image source={images.logoSmall || images.logoFilled} style={styles.logo} />
      <Text style={styles.title}>Camera disabled on Windows build</Text>
      <Text style={styles.subtitle}>
        VisionCamera/UVC/YouTube native camera are Android-only in this repo.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: 240,
    width: '100%',
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 96,
    height: 96,
    resizeMode: 'contain',
    marginBottom: 18,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: '#B8B8B8',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default memo(forwardRef(AplusVideo));