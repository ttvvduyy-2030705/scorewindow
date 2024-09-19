import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {keys} from 'configuration/keys';
import {
  WEBCAM_HOST,
  WEBCAM_LOGIN_PROFILE,
  WEBCAM_PATH,
  WEBCAM_PORT,
} from 'constants/webcam';
import {
  OnBufferData,
  OnLoadData,
  OnSeekData,
  OnVideoErrorData,
  OnVideoTracksData,
  VideoRef,
} from 'react-native-video';
import {streamWebcamToFile} from 'services/ffmpeg/webcam';
import {requestReadWriteStorage} from 'utils/permission';
import {navigate} from 'utils/navigation';
import {screens} from 'scenes/screens';

export interface Props {
  webcamFolderName?: string;
  updateWebcamFolderName: (name: string) => void;
}

const WebCamViewModel = (props: Props) => {
  const videoRef = useRef<VideoRef>(null);
  const [webcamIP, setWebcamIP] = useState<string>('');
  const [autoConnect, setAutoConnect] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [url, setUrl] = useState<string | undefined>();

  useEffect(() => {
    const _init = async () => {
      AsyncStorage.getItem(keys.WEBCAM_IP_ADDRESS, (error, result) => {
        if (!error && result) {
          setWebcamIP(result);
          setAutoConnect(false);
        }
      });
    };

    _init();
  }, []);

  useEffect(() => {
    if (!autoConnect) {
      return;
    }

    requestReadWriteStorage().then(isGranted => {
      if (!isGranted) {
        return;
      }

      const now = Date.now().toString();
      const _url = `${WEBCAM_HOST}${WEBCAM_LOGIN_PROFILE}@${webcamIP}:${WEBCAM_PORT}${WEBCAM_PATH}`;
      streamWebcamToFile(_url, now);
      setUrl(_url);
      props.updateWebcamFolderName(now);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webcamIP, autoConnect]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    const timeout = setTimeout(() => {
      setRefreshing(false);
      clearTimeout(timeout);
    }, 1000);
  }, []);

  const onDelay = useCallback(() => {}, []);

  const onReWatch = useCallback(async () => {
    navigate(screens.playback, {webcamFolderName: props.webcamFolderName});
  }, [props]);

  const onReconnectWebcam = useCallback(() => {
    setAutoConnect(true);
  }, []);

  const onFullscreenPlayerDidPresent = useCallback(() => {}, []);

  const onBuffer = useCallback((_data: OnBufferData) => {}, []);

  const onSeek = useCallback((_data: OnSeekData) => {}, []);

  const onLoad = useCallback(
    (_data: OnLoadData) => {
      videoRef.current?.setVolume(0);
      AsyncStorage.setItem(keys.WEBCAM_IP_ADDRESS, webcamIP);
    },
    [webcamIP],
  );

  const onVideoTracks = useCallback((_data: OnVideoTracksData) => {}, []);

  const onEnd = useCallback(() => {}, []);

  const onWebcamError = useCallback((e: OnVideoErrorData) => {
    console.log('On webcam error', e);
    setWebcamIP('');
  }, []);

  return useMemo(() => {
    return {
      videoRef,
      refreshing,
      autoConnect,
      webcamIP,
      source: {uri: url, type: 'rtsp'},
      onReconnectWebcam,
      onRefresh,
      onDelay,
      onReWatch,
      onFullscreenPlayerDidPresent,
      onBuffer,
      onSeek,
      onLoad,
      onVideoTracks,
      onEnd,
      onWebcamError,
    };
  }, [
    videoRef,
    refreshing,
    autoConnect,
    webcamIP,
    url,
    onReconnectWebcam,
    onRefresh,
    onDelay,
    onReWatch,
    onFullscreenPlayerDidPresent,
    onBuffer,
    onSeek,
    onLoad,
    onVideoTracks,
    onEnd,
    onWebcamError,
  ]);
};

export default WebCamViewModel;
