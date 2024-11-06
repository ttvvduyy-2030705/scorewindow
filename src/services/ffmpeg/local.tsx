import {FFmpegKit, SessionState} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import {WEBCAM_BASE_FILE_NAME, WEBCAM_FILE_EXTENSION} from 'constants/webcam';
import {WebcamType} from 'types/webcam';

let interval: NodeJS.Timeout, tempInterval: NodeJS.Timeout;

const _saveVideoInRange = async (
  folderPath: string,
  duration: number,
): Promise<{mergeFilesTemp: string; noneVideosExist: boolean}> => {
  const now = new Date();
  const mergeFilesTemp = `${folderPath}/mergeFiles.txt`;
  const isMergeFilesTempExist = await RNFS.exists(mergeFilesTemp);

  if (isMergeFilesTempExist) {
    await RNFS.unlink(mergeFilesTemp);
  }
  await RNFS.touch(mergeFilesTemp, now, now);

  let noneVideosExist = true;
  for (let i = 0; i < duration; i++) {
    const _fileName = i < 10 ? `0${i}` : i;
    const _filePath = `${folderPath}/${WEBCAM_BASE_FILE_NAME}${_fileName}${WEBCAM_FILE_EXTENSION}`;
    const isFilePathExists = await RNFS.exists(_filePath);

    if (!isFilePathExists) {
      continue;
    }

    noneVideosExist = false;
    await RNFS.write(mergeFilesTemp, `file '${_filePath}'\r\n`);
  }

  return {noneVideosExist, mergeFilesTemp};
};

const streamWebcamToFile = async (
  url: string,
  folderName: string,
  segmentTime: number,
  webcamType?: WebcamType,
) => {
  const folderPath = `${RNFS.DownloadDirectoryPath}/${folderName}`;

  await RNFS.mkdir(folderPath);

  if (webcamType === WebcamType.webcam) {
    FFmpegKit.executeAsync(
      `-i ${url} -acodec copy -vcodec copy -f segment -segment_time ${segmentTime} ${folderPath}/${WEBCAM_BASE_FILE_NAME}%02d${WEBCAM_FILE_EXTENSION}`,
    );
    return;
  }

  // const output = `${RNFS.DownloadDirectoryPath}/${WEBCAM_BASE_CAMERA_FOLDER}/${WEBCAM_OUTPUT_FILE_NAME}${CAMERA_FILE_EXTENSION}`;
  // const outputTemp = `${RNFS.DownloadDirectoryPath}/${WEBCAM_BASE_CAMERA_FOLDER}/${WEBCAM_OUTPUT_TEMP_FILE_NAME}.mov`;
  // FFmpegKit.executeAsync(
  //   `-y -f android_camera -i 0 -f mpegts udp://127.0.0.1:23000`,
  //   // -f segment -segment_time ${segmentTime} ${folderPath}/${WEBCAM_BASE_FILE_NAME}%02d${WEBCAM_FILE_EXTENSION}`,
  // );

  // tempInterval = setInterval(() => {
  //   FFmpegKit.executeAsync(
  //     `-y -sseof -3 -i ${output} -map 0:v:0 -drop_pkts_on_overflow 1 -attempt_recovery 1 -recover_any_error 1 ${outputTemp}`,
  //     // -f segment -segment_time ${segmentTime} ${folderPath}/${WEBCAM_BASE_FILE_NAME}%02d${WEBCAM_FILE_EXTENSION}`,
  //   );
  // }, 3000);
};

const mergeVideos = async (
  folderName: string,
  duration: number,
  options?: {
    cache?: boolean;
  },
): Promise<string | undefined> => {
  const folderPath = `${RNFS.DownloadDirectoryPath}/${folderName}`;
  const finalFile = `${folderPath}/${WEBCAM_BASE_FILE_NAME}duration_${duration}${WEBCAM_FILE_EXTENSION}`;
  const isFinalFileExists = await RNFS.exists(finalFile);

  if (isFinalFileExists) {
    //Use existing merged video
    if (options?.cache) {
      return finalFile;
    }

    await RNFS.unlink(finalFile);
  }

  const saveData = await _saveVideoInRange(folderPath, duration);

  if (saveData.noneVideosExist) {
    return undefined;
  }

  const cmdMergeVideos = `-f concat -safe 0 -fflags +discardcorrupt -i ${saveData.mergeFilesTemp} -c copy ${finalFile}`;
  const session = await FFmpegKit.executeAsync(cmdMergeVideos);

  let state = SessionState.RUNNING;
  do {
    state = await session.getState();
  } while (state === SessionState.RUNNING);

  return finalFile;
};

const cancelStreamWebcamToFile = () => {
  FFmpegKit.cancel();
  clearInterval(interval);
  clearInterval(tempInterval);
};

export {streamWebcamToFile, mergeVideos, cancelStreamWebcamToFile};
