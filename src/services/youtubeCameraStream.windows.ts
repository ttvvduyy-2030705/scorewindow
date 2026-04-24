export type YouTubeNativeCameraConfig = {
  enabled: boolean;
  streamUrl: string;
  width?: number;
  height?: number;
  fps?: number;
  videoBitrate?: number;
  audioBitrate?: number;
  sampleRate?: number;
  isStereo?: boolean;
  useFrontCamera?: boolean;
  audioEnabled?: boolean;
};

export type YouTubeNativeZoomInfo = {
  zoom: number;
  minZoom: number;
  maxZoom: number;
  source: string;
};

let currentConfig: YouTubeNativeCameraConfig | null = null;

export const configureYouTubeNativeCamera = async (
  config: YouTubeNativeCameraConfig,
) => {
  currentConfig = config;
};

export const clearYouTubeNativeCamera = async () => {
  currentConfig = null;
};

export const startYouTubeNativeStream = async () => {
  throw new Error('YouTube native camera stream is disabled on Windows build.');
};

export const stopYouTubeNativeStream = async () => undefined;

export const startYouTubeNativeRecord = async (_path: string) => {
  throw new Error('YouTube native recording is disabled on Windows build.');
};

export const stopYouTubeNativeRecord = async () => null;

export const setYouTubeNativeZoom = async (_zoom: number) => undefined;

export const getYouTubeNativeZoomInfo =
  async (): Promise<YouTubeNativeZoomInfo> => ({
    zoom: 1,
    minZoom: 1,
    maxZoom: 1,
    source: 'windows-disabled',
  });

export const isYouTubeNativeCameraEnabled = () => false;

export const getYouTubeNativeCameraConfig = () => currentConfig;

export const addYouTubeCameraStreamListener = (
  _event: string,
  _listener: (payload?: Record<string, unknown> | null) => void,
) => {
  return {remove: () => undefined};
};