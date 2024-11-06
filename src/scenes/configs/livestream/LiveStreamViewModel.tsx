import {useCallback, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {keys} from 'configuration/keys';
import {LiveStreamCamera, OutputType, WebcamType} from 'types/webcam';

const LiveStreamViewModel = () => {
  const [liveStreamData, setLiveStreamData] = useState<LiveStreamCamera>({
    rtmpUrl: '',
    streamKey: '',
    outputType: OutputType.livestream,
  });
  const [allowToSave, setAllowToSave] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet(
      [keys.CAMERA_RTMP_URL, keys.CAMERA_STREAM_KEY, keys.OUTPUT_TYPE],
      (error, result) => {
        if (!error && result) {
          const _rtmpUrl = result[0][1];
          const _streamKey = result[1][1];
          const _outputType = result[2][1];

          if (!_rtmpUrl || !_streamKey || !_outputType) {
            return;
          }

          setLiveStreamData({
            rtmpUrl: _rtmpUrl,
            streamKey: _streamKey,
            outputType: _outputType as OutputType,
          });
        }
      },
    );
  }, []);

  useEffect(() => {
    setAllowToSave(
      liveStreamData.outputType === OutputType.livestream
        ? liveStreamData.rtmpUrl && liveStreamData.streamKey
          ? true
          : false
        : true,
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
    AsyncStorage.setItem(
      keys.OUTPUT_TYPE,
      liveStreamData.outputType.toString(),
    );

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
      onSelectOutputTypeLocal: onChangeValue('outputType'),
      onSelectOutputTypeLiveStream: onChangeValue('outputType'),
      onSaveConfig,
    };
  }, [liveStreamData, allowToSave, onChangeValue, onSaveConfig]);
};

export default LiveStreamViewModel;
