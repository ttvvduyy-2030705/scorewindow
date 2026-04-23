# Windows build fix v3

This patch disables Windows autolinking for packages whose Windows native projects
pull `Microsoft.UI.Xaml 2.8.0` (WinUI 2), which conflicts with the app's
`Microsoft.WindowsAppSDK 1.5.x` / WinUI 3 toolchain and causes duplicate `.winmd`
types during MSBuild.

Packages disabled for Windows autolinking:
- `@react-native-async-storage/async-storage`
- `@react-native-community/netinfo`
- `react-native-device-info`
- `react-native-screens`

The app already contains several `*.windows.tsx` fallbacks, so this avoids the
native Windows conflict without touching Android/iOS.
