# Aplus Windows arch fix v3

Patch v2 đã sửa được lỗi `Bootstrap.lib`. Log mới đổi sang lỗi:

```text
MSB3271: project being built "AMD64" nhưng Microsoft.ReactNative.dll là "x86"
```

Nguyên nhân: trong `.sln`, một số project React Native Windows vẫn đang map `Debug|x64` sang `Debug|Win32`, nên tạo ra DLL x86 trong khi app/dependency khác build x64.

## Cách chạy

Copy `apply_windows_arch_fix_v3.js` vào root repo `C:\project\scorewindow`, rồi chạy:

```powershell
cd C:\project\scorewindow
node apply_windows_arch_fix_v3.js
npm run windows:deepclean
npm run windows
```

Nếu vẫn lỗi:

```powershell
npm run windows:logging
```

Patch này chỉ sửa build Windows:
- patch `windows/*.sln` mapping x64
- giữ fix WindowsAppSDK `win10-`
- clean output x86 cũ
- không sửa Android / backend / OAuth / gameplay logic
