This patch removes WinUI 2 Windows native modules from the RNW solution and generated autolink files:
- @react-native-async-storage/async-storage
- @react-native-community/netinfo
- react-native-device-info
- react-native-screens

Reason: they pull Microsoft.UI.Xaml 2.8.0 and conflict with Microsoft.WindowsAppSDK 1.5 WinUI 3 metadata.

Apply by extracting over repo root. Then DO NOT run `npx react-native autolink-windows` or `react-native run-windows` until after a successful direct MSBuild test, because autolink may regenerate the removed entries.
