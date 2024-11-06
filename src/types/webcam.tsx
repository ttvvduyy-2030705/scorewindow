export const enum OutputType {
  local = 'local',
  livestream = 'livestream',
}

export type WebcamFile = {
  id: number;
  name: string;
  path: string;
};

export type Webcam = {
  webcamIP: string;
  username: string;
  password: string;
  syncTime: number;
  scale?: number;
  translateX?: number;
  translateY?: number;
  outputType: OutputType;
};

export type LiveStreamCamera = {
  rtmpUrl: string;
  streamKey: string;
  outputType: OutputType;
};

export enum WebcamType {
  webcam = 'webcam',
  camera = 'camera',
}
