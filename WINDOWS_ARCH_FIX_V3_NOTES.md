# Aplus Windows arch fix v3

Log mới đã qua lỗi Bootstrap.lib, nhưng fail ở:

```
MSB3271: project being built "AMD64" nhưng implementation file Microsoft.ReactNative.dll là "x86"
```

Nguyên nhân: solution đang build `Debug|x64`, nhưng một số native dependency project trong `.sln`
vẫn map `Debug|x64 -> Debug|Win32`. Vì vậy `Microsoft.ReactNative.dll` bị build ra x86,
trong khi AsyncStorage/app đang build AMD64.

Patch này:
- sửa `windows/*.sln` để `Debug|x64` và `Release|x64` map đúng sang `x64`, không sang `Win32`
- giữ fix WindowsAppSDK `win10-` của v2
- thêm clean sâu các output x86 cũ trong `node_modules/react-native-windows/target`
- không sửa Android, không sửa backend/OAuth, không sửa logic gameplay

Chạy:

```powershell
node apply_windows_arch_fix_v3.js
npm run windows:deepclean
npm run windows
```

Nếu vẫn lỗi:

```powershell
npm run windows:logging
```

Trong log mới cần nhìn dòng:
```
[Aplus Windows] MSBuild project=Microsoft.ReactNative; Platform=x64; PlatformTarget=x64
```

Không được còn:
```
Platform=Win32; PlatformTarget=x86
```
cho `Microsoft.ReactNative`, `Common`, `Folly`.
