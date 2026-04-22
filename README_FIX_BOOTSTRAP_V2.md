# Aplus Windows fix v2 — Microsoft.WindowsAppRuntime.Bootstrap.lib win10-

Log mới cho thấy patch trước chưa đủ. MSBuild vẫn sinh đường dẫn:

```text
lib\win10-\Microsoft.WindowsAppRuntime.Bootstrap.lib
```

Patch v2 này xử lý trực tiếp `Microsoft.WindowsAppSDK` trong NuGet cache:
- copy `lib\win10-x64` thành `lib\win10-`
- patch `.targets/.props` để `win10-$(...)` thành `win10-x64`
- sửa `package.json` để trước mỗi lần build Windows tự chạy `windows:prep`

## Cách chạy

Copy `apply_windows_bootstrap_fix_v2.js` vào root repo `C:\project\scorewindow`, rồi chạy:

```powershell
node apply_windows_bootstrap_fix_v2.js
npm run windows:clean
npm run windows
```

Nếu vẫn lỗi:

```powershell
npm run windows:logging
```

Patch này chỉ xử lý Windows build. Android không bị ảnh hưởng.
