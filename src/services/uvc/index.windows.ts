export type UsbProbeItem = {
  deviceName: string;
  vendorId: number;
  productId: number;
  deviceClass: number;
  deviceSubclass: number;
  looksLikeVideo: boolean;
};

export type UvcZoomInfo = {
  supported: boolean;
  minZoom: number;
  maxZoom: number;
  zoom: number;
  source?: string;
};

export async function listUsbDevices(): Promise<UsbProbeItem[]> {
  return [];
}

export async function startUvcRecording(_outputPath: string): Promise<string> {
  throw new Error('UVC recording is disabled on Windows build.');
}

export async function stopUvcRecording(): Promise<string | null> {
  return null;
}

export async function setUvcZoom(_zoom: number): Promise<number> {
  return 1;
}

export async function getUvcZoomInfo(): Promise<UvcZoomInfo> {
  return {
    supported: false,
    minZoom: 1,
    maxZoom: 1,
    zoom: 1,
    source: 'windows-disabled',
  };
}