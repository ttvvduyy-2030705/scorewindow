import {MATCH_IMAGE, WEBCAM_BASE_CAMERA_FOLDER} from 'constants/webcam';
import {FFmpegKit} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import {LiveStreamCamera} from 'types/webcam';

const liveStreamFromCamera = async (liveStream?: LiveStreamCamera) => {
  const folderPath = `${RNFS.DownloadDirectoryPath}/${WEBCAM_BASE_CAMERA_FOLDER}`;
  const matchImagePath = `${RNFS.DownloadDirectoryPath}/${WEBCAM_BASE_CAMERA_FOLDER}/${MATCH_IMAGE}`;

  const isFolderExist = await RNFS.exists(folderPath);

  if (!isFolderExist) {
    await RNFS.mkdir(folderPath);
  }

  FFmpegKit.executeAsync(
    `-y -video_size hd720 -f android_camera -i 0 \
    -f image2 -loop 1 -i ${matchImagePath} -filter_complex "overlay=0:(main_h-overlay_h)-(main_h * 0.05)" \
    -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 \
    -f flv ${liveStream?.rtmpUrl}/${liveStream?.streamKey}`,
  );
};

//-input_queue_size 2048
//-f flv ${liveStream?.rtmpUrl}/${liveStream?.streamKey} \
//-f mpegts -movflags faststart ${outputFile}
//-movflags faststart

export {liveStreamFromCamera};
