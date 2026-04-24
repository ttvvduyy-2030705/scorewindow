export type YouTubeNativeOverlayPlayer = {
  name?: string;
  flag?: string;
  score?: number;
  currentPoint?: number;
};

export type YouTubeNativeOverlayThumbnails = {
  enabled?: boolean;
  topLeft?: string[];
  topRight?: string[];
  bottomLeft?: string[];
  bottomRight?: string[];
};

export type YouTubeNativeOverlayPayload = {
  visible?: boolean;
  variant?: 'pool' | 'carom';
  source?: 'gameplay-shared-overlay-snapshot' | string;
  snapshotUri?: string;
  snapshotWidth?: number;
  snapshotHeight?: number;
  updatedAt?: number;
  currentPlayerIndex?: number;
  countdownTime?: number;
  baseCountdown?: number;
  goal?: number;
  totalTurns?: number;
  players?: YouTubeNativeOverlayPlayer[];
  thumbnails?: YouTubeNativeOverlayThumbnails;
};

export const isYouTubeNativeLiveEngineMounted = () => false;

export const isYouTubeNativePreviewViewAvailable = () => false;

export const isYouTubeNativeLiveReady = () => false;

export const prepareYouTubeNativePreview = async () => false;

export const startYouTubeNativeLive = async () => {
  throw new Error('YouTube native live is disabled on Windows build.');
};

export const stopYouTubeNativeLive = async () => false;

export const startYouTubeNativeRecord = async (_path: string) => {
  throw new Error('YouTube native record is disabled on Windows build.');
};

export const stopYouTubeNativeRecord = async (): Promise<string | null> => null;

export const updateYouTubeNativeOverlay = async (
  _payload: YouTubeNativeOverlayPayload,
) => false;

export const switchYouTubeNativeCamera = async () => false;

export const getYouTubeNativeZoomInfo = async () => ({
  supported: false,
  minZoom: 1,
  maxZoom: 1,
  zoom: 1,
  source: 'windows-disabled',
});

export const setYouTubeNativeZoom = async (_level: number) => false;

export const subscribeYouTubeNativeLiveState = (
  _listener: (event: {type?: string; message?: string}) => void,
) => {
  return () => undefined;
};