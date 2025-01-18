import React, {memo, useMemo, forwardRef, useRef, useEffect, useState} from 'react';
import RNVideo, {Video, VideoRef} from 'react-native-video';
import {GestureDetector} from 'react-native-gesture-handler';
import RNAnimated from 'react-native-reanimated';
import Loading from 'components/Loading';
import View from 'components/View';
import VideoViewModel, {Props} from './VideoViewModel';
import { Camera, useCameraDevices, useFrameProcessor, useCameraDevice, CameraPosition,useCameraFormat } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import styles from './styles';
import colors from 'configuration/colors';
import { WEBCAM_SELECTED_VIDEO_TRACK } from 'constants/webcam';



const AplusVideo = (props: Props, ref: React.LegacyRef<Camera>) => {
  const viewModel = VideoViewModel(props);
  //const device  = useCameraDevice('back');
  const devices = useCameraDevices();
  const [videoUri, setVideoUri] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null);

  const cacheDir = RNFS.TemporaryDirectoryPath;
  const videoPath = `${cacheDir}/mrousavy6174524151984579464.mov`; // Replace with your file name

  // useEffect(() => {
  //   const checkFile = async () => {
  //     const exists = await RNFS.exists(videoPath);
  //     console.log("v" + videoPath)
  //     if (exists) {
  //       setVideoUri(`file:/${videoPath}`);
  //     } else {
  //       console.error('Video file not found:', videoPath);
  //     }
  //   };
  //   checkFile();
  // }, [videoPath]);

  const format = useCameraFormat(devices[0], [
    { videoResolution: { width: 1280, height: 720 } }
  ])

  const WEBCAM_LOADER = useMemo(() => {
    if (props.loadingDisabled) {
      return undefined;
    }

    return (
      <View
        flex={'1'}
        style={styles.loading}
        alignItems={'center'}
        justify={'center'}>
        <Loading isLoading size={'large'} showPlainLoading />
      </View>
    );
  }, [props]);

  return (
    <GestureDetector gesture={viewModel.gestureComposed}>
      <RNAnimated.View style={[styles.container, viewModel.animatedStyles]}>
        {/* <RNVideo
          id={'webcam-billiards'}
         
          style={styles.webcam}
          source={props.source}
          selectedVideoTrack={WEBCAM_SELECTED_VIDEO_TRACK}
          shutterColor={colors.transparent}
          onReadyForDisplay={viewModel.onReadyForDisplay}
          onFullscreenPlayerDidPresent={viewModel.onFullscreenPlayerDidPresent}
          onBuffer={viewModel.onBuffer}
          onSeek={viewModel.onSeek}
          onLoad={viewModel.onLoad}
          onVideoTracks={viewModel.onVideoTracks}
          onEnd={viewModel.onEnd}
          onError={viewModel.onError}
          paused={false}
          renderLoader={WEBCAM_LOADER}
        /> */}


        <Camera
          ref={props.cameraRef}
          style={styles.webcam}
          device={devices[0]}
          isActive={true}
          video={true}
          format={format}
          //frameProcessor={}
          //preview={true}
          //enableZoomGesture={true}
          // frameProcessor={handleFrame}
        />  

{/* <Video
          source={{ uri: "file://data/user/0/com.aplus.score/cache/mrousavy7367584100780418910.mov" }}
          style={styles.video}
          controls // Enable playback controls
          resizeMode="stretch" // Ensure video fits within the view
        /> */}

        {/* {!props.isPreview ? (
          <Camera
          ref={props.cameraRef}
          style={styles.webcam}
          device={devices[0]}
          isActive={true}
          video={true}
          
          preview={true}
          enableZoomGesture={true}
          frameProcessor={handleFrame}

          />  
        ) : (

          <Video
          source={{ uri: "file:///data/user/0/com.aplus.score/cache/mrousavy7367584100780418910.mov" }}
          style={styles.video}
          controls // Enable playback controls
          resizeMode="stretch" // Ensure video fits within the view
        /> */}

        {/* )} */}
 {/* {videoUri ? (
        <Video
          source={{ uri: videoUri }}
          style={styles.video}
          controls // Enable playback controls
          resizeMode="stretch" // Ensure video fits within the view
        />
      ) : (
        <Text style={styles.errorText}>Video not found in cache!</Text>
      )} */}
     
      </RNAnimated.View>
    </GestureDetector>
  );
};

export default memo(forwardRef(AplusVideo));
