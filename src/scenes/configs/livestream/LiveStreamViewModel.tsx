import AsyncStorage from '@react-native-community/async-storage';
import {keys} from 'configuration/keys';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {LiveStreamCamera, WebcamType} from 'types/webcam';

const LiveStreamViewModel = () => {
  const [liveStreamData, setLiveStreamData] = useState<LiveStreamCamera>({
    rtmpUrl: '',
    streamKey: '',
  });
  const [allowToSave, setAllowToSave] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet(
      [keys.CAMERA_RTMP_URL, keys.CAMERA_STREAM_KEY],
      (error, result) => {
        if (!error && result) {
          const _rtmpUrl = result[0][1];
          const _streamKey = result[1][1];

          if (!_rtmpUrl || !_streamKey) {
            return;
          }

          setLiveStreamData({
            rtmpUrl: _rtmpUrl,
            streamKey: _streamKey,
          });
        }
      },
    );
  }, []);

  useEffect(() => {
    setAllowToSave(
      liveStreamData.rtmpUrl && liveStreamData.streamKey ? true : false,
    );
  }, [liveStreamData]);

  const onChangeValue = useCallback(
    (key: string) => (value: string) => {
      setLiveStreamData(prev => ({...prev, [key]: value}));
    },
    [],
  );

  const onSaveConfig = useCallback(() => {
    AsyncStorage.setItem(keys.WEBCAM_TYPE, WebcamType.camera);
    AsyncStorage.setItem(keys.CAMERA_RTMP_URL, liveStreamData.rtmpUrl);
    AsyncStorage.setItem(keys.CAMERA_STREAM_KEY, liveStreamData.streamKey);

    setAllowToSave(false);

    const timeout = setTimeout(() => {
      setAllowToSave(true);
      clearTimeout(timeout);
    }, 1000);
  }, [liveStreamData]);

  return useMemo(() => {
    return {
      liveStreamData,
      allowToSave,
      onChangeRTMPUrl: onChangeValue('rtmpUrl'),
      onChangeStreamKey: onChangeValue('streamKey'),
      onChangeChannelId: onChangeValue('channelId'),
      onSaveConfig,
    };
  }, [liveStreamData, allowToSave, onChangeValue, onSaveConfig]);
};

export default LiveStreamViewModel;
