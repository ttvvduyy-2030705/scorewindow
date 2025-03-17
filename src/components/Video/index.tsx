import React, {memo, useMemo, forwardRef, useState, useEffect, RefObject, useRef} from 'react';
import {Orientation, Video, VideoRef} from 'react-native-video';
import {Gesture, GestureDetector, GestureHandlerRootView} from 'react-native-gesture-handler';
import RNAnimated, { runOnJS, runOnUI, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Loading from 'components/Loading';
import View from 'components/View';
import VideoViewModel, {Props} from './VideoViewModel';
import styles from './styles';
import colors from 'configuration/colors';
import { WEBCAM_SELECTED_VIDEO_TRACK } from 'constants/webcam';
import { Fps, WebcamType } from 'types/webcam';
import { PinchGestureHandler } from 'react-native-gesture-handler';
import {  ImageBackground, ToastAndroid } from 'react-native';
import images from 'assets';
import { Camera, Frame, useCameraDevice, useCameraFormat, useFrameProcessor, VisionCameraProxy } from 'react-native-vision-camera';
import { useSharedValue, Worklets }from 'react-native-worklets-core';

const AplusVideo = (props: Props, ref: React.LegacyRef<VideoRef>) => {
  const showToast = () => {
    ToastAndroid.show('Camera không trợ zoom!', ToastAndroid.SHORT);
  };
  const viewModel = VideoViewModel(props);

  const device = useCameraDevice('front');

 // console.log("device" + JSON.stringify(device));

  const scale = useSharedValue(1); // Default scale
  const doubleTapZoom = 2; // Zoom level for double-tap
  const maxZoom = 128; // Max pinch zoom level
  const minZoom = 0; // Minimum zoom level

  // Pinch Gesture for Smooth Zooming
  const pinchGesture = Gesture.Pinch()
  .onUpdate((event) => {
    scale.value = Math.max(minZoom, Math.min(event.scale, maxZoom)); // Clamp zoom level

    console.log("pinch" , scale.value)
  })
  .onEnd(() => {
    if (scale.value < minZoom) {
      scale.value = withSpring(minZoom); // Reset to default zoom if too small
    }
  });

  // Double Tap Gesture for Quick Zoom In/Out
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = scale.value === 1 ? withSpring(doubleTapZoom) : withSpring(1);
    });

  // Apply Animated Zoom Effect
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));


  const processFrame = (frame: any) => {
    // Here, you can apply AI processing, filters, etc.g

    console.log('Frame received:', frame);
  };

  const processFrameJS = Worklets.createRunOnJS(processFrame);

  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';
    //console.log(`Processing frame: ${frame.width}x${frame.height}`);
    //runOnJS(processFrameJS)
  }, []);

  const format = useCameraFormat(device, [
    { videoResolution: { width: 2550, height: 1440 } }
  ])

  return (
    <GestureDetector gesture={pinchGesture}>
      <RNAnimated.View style={[styles.container, viewModel.animatedStyles]} >
            { device ? ( <Camera
            ref={props.cameraRef}
            style={styles.webcam}
            device={device!}
            isActive={true}
            video={true}
            audio={true}
            format={format}
            zoom={scale.value}
            videoStabilizationMode="standard"
            enableZoomGesture={true}
            //enableFpsGraph={true}
            //frameProcessor={frameProcessor}
            //outputOrientation='preview'
            fps={30}
            enableDepthData
            pixelFormat="yuv"
            onInitialized={() => props.setIsCameraReady(true)} // ✅ Set the camera as ready
            onStopped={() => props.setIsCameraReady(false)}
            onStarted={() => props.setIsCameraReady(true)}
            /> ): (
              <ImageBackground
                source={images.logoclb} // Replace with your image URL or local asset
                style={styles.background}
                resizeMode="stretch">
                </ImageBackground>
            ) }
     </RNAnimated.View>
    </GestureDetector>
  );
};

export default memo(forwardRef(AplusVideo));
