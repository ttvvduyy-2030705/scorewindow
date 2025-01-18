import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert} from 'react-native';
import {OnVideoErrorData, VideoRef} from 'react-native-video';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {mergeVideos} from 'services/ffmpeg/local';
import i18n from 'i18n';
import { usePreviewContext } from 'context/PreviewVideo';

export interface PlayBackWebcamViewModelProps {
  webcamFolderName: string;
  cache?: boolean;
  videoUri?: string;
}

const PlayBackWebcamViewModel = (props: PlayBackWebcamViewModelProps) => {
  const videoRef = useRef<VideoRef>(null);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [webcamUrl, setWebcamUrl] = useState<string>();
  const [selectedDurationIndex, setSelectedDurationIndex] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isPreview, setIsPreview , videoUri, setIsRewatch} = usePreviewContext();

  useEffect(() => {

    console.log("Play Back" + props.webcamFolderName);
    console.log("video Uri " + videoUri);

    const folder = `${RNFS.DownloadDirectoryPath}/${props.webcamFolderName}`;

    RNFS.exists(folder).then(
      isExist => {
        if (!isExist) {

          console.log("File is not Exit " + folder);

          return;
        }

        RNFS.readDir(
          `${RNFS.DownloadDirectoryPath}/${props.webcamFolderName}`,
        ).then(result => {

          console.log("Total Files " + result.length);

          const numOfFiles: number = result.length;
          setTotalFiles(numOfFiles);
        });
      },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreview, videoUri]);

  const onSelectMinuteForWebcam = useCallback(
    async (index: number, duration: number) => {
      setIsLoading(true);
      setSelectedDurationIndex(index);
      setIsRewatch(false)
     // setWebcamUrl(props.videoUri);
      
      if(totalFiles < 2){
        setWebcamUrl(videoUri);
        setIsLoading(false);
      }else{
        const fullVideoPath = await mergeVideos(
          props.webcamFolderName,
          duration === -1 ? totalFiles : duration * 20,
          {
            cache: props.cache,
          },
        );
  
        if (!fullVideoPath) {
          Alert.alert(i18n.t('txtError'), i18n.t('msgWebcamVideoNotExist'));
          return;
        }
  
        setWebcamUrl(fullVideoPath);
        setIsLoading(false);
      }

    },
    [props, totalFiles],
  );

  const onWebcamError = useCallback((e: OnVideoErrorData) => {
    if (__DEV__) {
      console.log('On webcam error', e);
    }
  }, []);

  const onShareVideo = useCallback(() => {
    Share.open({url: `file://${webcamUrl}`}).catch(err => {
      err && console.log(err);
    });
    console.log(" " + props.videoUri);

    Share.open({url: props.videoUri}).catch(err => {
      err && console.log(err);
    });
  }, [webcamUrl]);


  return useMemo(() => {
    return {
      videoRef,
      isLoading,
      selectedDurationIndex,
      webcamUrl,
      onSelectMinuteForWebcam,
      onWebcamError,
      onShareVideo,
      setIsPreview
    };
  }, [
    videoRef,
    isLoading,
    selectedDurationIndex,
    webcamUrl,
    onSelectMinuteForWebcam,
    onWebcamError,
    onShareVideo,
    props.videoUri,
    setIsPreview
  ]);
};

export default PlayBackWebcamViewModel;
