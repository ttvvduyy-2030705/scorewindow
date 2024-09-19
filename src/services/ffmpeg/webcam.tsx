import {FFmpegKit, FFmpegKitConfig} from 'ffmpeg-kit-react-native';

const streamWebcamToFile = async (url: string, fileName: string) => {
  FFmpegKitConfig.selectDocumentForWrite(`${fileName}.mov`, 'video/*').then(
    uri => {
      FFmpegKitConfig.getSafParameterForWrite(uri).then(safUrl => {
        FFmpegKit.executeAsync(`-i ${url} -acodec copy -vcodec copy ${safUrl}`);
      });
    },
  );
};

const cancelStreamWebcamToFile = () => {
  FFmpegKit.cancel();
};

export {streamWebcamToFile, cancelStreamWebcamToFile};
