import {
  MATCH_COUNTDOWN,
  MATCH_IMAGE,
  WEBCAM_BASE_CAMERA_FOLDER,
} from 'constants/webcam';
import {FFmpegKit} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import {LiveStreamCamera, WebcamType} from 'types/webcam';

const liveStreamFromCamera = async (
  liveStream?: LiveStreamCamera,
  webcamUrl?: string,
  webcamType?: WebcamType,
  countdownEnabled?: boolean,
) => {
  const folderPath = `${RNFS.DownloadDirectoryPath}/${WEBCAM_BASE_CAMERA_FOLDER}`;
  const matchImagePath = `${RNFS.DownloadDirectoryPath}/${WEBCAM_BASE_CAMERA_FOLDER}/${MATCH_IMAGE}`;
  const matchCountdownImagePath = `${RNFS.DownloadDirectoryPath}/${WEBCAM_BASE_CAMERA_FOLDER}/${MATCH_COUNTDOWN}`;

  const isFolderExist = await RNFS.exists(folderPath);

  if (!isFolderExist) {
    await RNFS.mkdir(folderPath);
  }

  const videoAndMatchInfo = `-y -video_size 1920x1080 -f android_camera -i 0 -f image2 -stream_loop -1 -i ${matchImagePath}`;
  const audioAndOutput = `-f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 \
      -f flv -drop_pkts_on_overflow 1 -attempt_recovery 1 -recover_any_error 1 -preset medium -b:v 5000k -maxrate 6000k -bufsize 12000k ${liveStream?.rtmpUrl}/${liveStream?.streamKey}`;
  const filterComplex = `-f image2 -stream_loop -1 -i ${matchCountdownImagePath} -filter_complex "hflip[flipped];[flipped][1]overlay=(W-w)/2:(H-h)-60[img1];[2:v]scale=640:35[img2];[img1][img2]overlay=(W-w)/2:(H-h)-25"`;

  if (webcamType === WebcamType.camera) {
    FFmpegKit.executeAsync(
      `${videoAndMatchInfo} \
      ${countdownEnabled ? filterComplex : ''} \
      ${audioAndOutput}`,
    );
    return;
  }

  const webcamAndMatchInfo = `-y -i ${webcamUrl} -f image2 -stream_loop -1 -i ${matchImagePath}`;

  FFmpegKit.executeAsync(
    `${webcamAndMatchInfo} \
    ${countdownEnabled ? filterComplex : ''} \
    ${audioAndOutput}`,
  );
};

// -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 \
// -f image2 -stream_loop -1 -i ${matchImagePath} -stream_loop -1 -i ${matchCountdownImagePath} -filter_complex "overlay=25:25,overlay=25:180"
//-input_queue_size 2048
//-f flv ${liveStream?.rtmpUrl}/${liveStream?.streamKey} \
//-f mpegts -movflags faststart ${outputFile}
//-movflags faststart

export {liveStreamFromCamera};
