import {FFmpegKit} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import {WEBCAM_BASE_FILE_NAME, WEBCAM_FILE_EXTENSION} from 'constants/webcam';

const streamWebcamToFile = async (url: string, folderName: string) => {
  const folderPath = `${RNFS.DownloadDirectoryPath}/${folderName}`;
  await RNFS.mkdir(folderPath);
  FFmpegKit.executeAsync(
    `-i ${url} -acodec copy -vcodec copy -f segment -segment_time 60 ${folderPath}/${WEBCAM_BASE_FILE_NAME}%02d${WEBCAM_FILE_EXTENSION}`,
  );
};

const cancelStreamWebcamToFile = () => {
  FFmpegKit.cancel();
};

export {streamWebcamToFile, cancelStreamWebcamToFile};
