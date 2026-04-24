class BLEServiceInstance {
  isPermissionsGranted = false;

  requestBluetoothPermissions = async () => {
    this.isPermissionsGranted = false;
    return false;
  };

  scanAndConnect = async () => {
    console.log('[Windows] BLE remote is disabled.');
  };
}

export const BLEService = new BLEServiceInstance();