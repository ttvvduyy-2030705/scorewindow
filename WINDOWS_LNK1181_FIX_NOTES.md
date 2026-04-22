# Fix lỗi Windows LNK1181 Bootstrap.lib

Lỗi:
```
LINK : fatal error LNK1181:
cannot open input file ...\microsoft.windowsappsdk\1.5.240227000\...\lib\win10-\Microsoft.WindowsAppRuntime.Bootstrap.lib
```

Nguyên nhân: MSBuild/NuGet đang sinh đường dẫn `win10-` bị thiếu kiến trúc CPU. Đúng ra với máy x64 phải là:
```
lib\win10-x64\Microsoft.WindowsAppRuntime.Bootstrap.lib
```

Patch này:
- ép script Windows chạy với `--arch x64`
- thêm `Directory.Build.props`
- thêm `Directory.Build.targets`
- set `PlatformTarget=x64` khi `Platform=x64`
- không sửa Android package/app id/backend/OAuth
- không động vào logic gameplay Android

Chạy:
```powershell
node fix_windows_lnk1181_bootstrap.js
npm run windows:clean
npm run windows
```

Nếu vẫn lỗi, chạy bản log:
```powershell
npm run windows:logging
```
