# Aplus Windows LNK1181 fix

Copy `fix_windows_lnk1181_bootstrap.js` vào root repo `C:\project\scorewindow`, rồi chạy:

```powershell
node fix_windows_lnk1181_bootstrap.js
npm run windows:clean
npm run windows
```

Nếu vẫn lỗi:

```powershell
npm run windows:logging
```

Patch này chỉ xử lý lỗi linker `win10-\Microsoft.WindowsAppRuntime.Bootstrap.lib` bằng cách ép `PlatformTarget=x64` cho MSBuild Windows. Android không bị ảnh hưởng.
