export type WebcamFile = {
  id: number;
  name: string;
  path: string;
};

export type Webcam = {
  webcamIP: string;
  username: string;
  password: string;
  scale?: number;
  translateX?: number;
  translateY?: number;
};
