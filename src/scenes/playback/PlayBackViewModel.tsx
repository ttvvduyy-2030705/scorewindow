import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert} from 'react-native';
import {OnVideoErrorData, VideoRef} from 'react-native-video';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {mergeVideoFiles, getFiles} from 'services/ffmpeg/local';
import i18n from 'i18n';

export interface PlayBackWebcamViewModelProps {
  webcamFolderName: string;
  merged: boolean;
  videoUri?: string;

}

const PlayBackWebcamViewModel = (props: PlayBackWebcamViewModelProps) => {
  const videoRef = useRef<VideoRef>(null);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [webcamUrl, setWebcamUrl] = useState<string>();
  const [selectedDurationIndex, setSelectedDurationIndex] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoDurations, setVideoDurations] = useState<any>({}); // Store duration per file
  const [videoFiles, setVideoFiles] = useState<string[]>([]);
  const [startTime, setStartTime] = useState(0); // Start time in seconds
  const [endTime, setEndTime] = useState(0); // End time in seconds
  const handleVideoLoad = (videoUri: any, duration: any) => {
    setVideoDurations((prev: any) => ({ ...prev, [videoUri]: duration }));
  };

  const [isPlaying, setIsPlaying] = useState(false);


  const handleLoad = () => {
    videoRef.current?.seek(startTime);
  };

  // Stop the video at the specified end time
  const handleProgress = (data: any) => {
    if (data.currentTime >= endTime && isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const startPlayback = () => {
    if (videoRef.current) {
      videoRef.current.seek(startTime);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const folder = `${RNFS.DownloadDirectoryPath}/${props.webcamFolderName}`;

    RNFS.exists(folder).then(
     isExist => {
        if (!isExist) {

          console.log("File is not Exit " + folder);

          return;
        }

        // const files = await getFiles(props.webcamFolderName);

        // if(files && files?.length > 0){
        //   setWebcamUrl(files[0].path)
        // }

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
  }, [ webcamUrl]);

  const onSelectMinuteForWebcam = useCallback(
    async (index: number, duration: number) => {
      setIsLoading(true);
      setSelectedDurationIndex(index);
      console.log("index " + index);

      console.log("view video");

      if(totalFiles < 2){

        console.log("view video");

        const files = await getFiles(props.webcamFolderName);

        console.log("file" + JSON.stringify(files));
        if(files){
          setWebcamUrl(files[0].path);
        }
 
        setIsLoading(false);
      } else {
        if(props.merged){
          const fullVideoPath = await mergeVideoFiles(props.webcamFolderName)
  
          if (!fullVideoPath) {
            Alert.alert(i18n.t('txtError'), i18n.t('msgWebcamVideoNotExist'));
            return;
          }
          setWebcamUrl(fullVideoPath);
        }else{
          const files = await getFiles(props.webcamFolderName);

          console.log("file" + JSON.stringify(files));
          if(files){
            setWebcamUrl(files[0].path);
          }
        }
        
  
        setIsLoading(false);
      }

      setStartTime(duration*60);

      if (videoRef.current) {
        videoRef.current.seek(duration);
        setIsPlaying(true);
      }
    },
    [props, totalFiles, webcamUrl],
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
      handleVideoLoad,
      handleProgress,
      isPlaying,
      handleLoad
    };
  }, [
    videoRef,
    isLoading,
    selectedDurationIndex,
    webcamUrl,
    onSelectMinuteForWebcam,
    onWebcamError,
    onShareVideo,
    handleVideoLoad,
    handleProgress,
    isPlaying,
    handleLoad
  ]);
};

export default PlayBackWebcamViewModel;
