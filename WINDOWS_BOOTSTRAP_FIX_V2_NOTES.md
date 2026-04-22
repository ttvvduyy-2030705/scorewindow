# Aplus Windows Bootstrap.lib fix v2

Log hiện tại cho thấy môi trường RNW đã OK, nhưng WindowsAppSDK/RNW sinh sai đường dẫn:

```
lib\win10-\Microsoft.WindowsAppRuntime.Bootstrap.lib
```

Đúng với build x64 phải là:

```
lib\win10-x64\Microsoft.WindowsAppRuntime.Bootstrap.lib
```

Patch này làm 2 việc:

1. Thêm `scripts/patch-winappsdk-bootstrap-x64.js`
2. Sửa scripts trong `package.json` để trước mỗi lần `npm run windows` luôn chạy:
   ```
   npm run windows:prep
   ```

`windows:prep` sẽ:
- tìm `%USERPROFILE%\.nuget\packages\microsoft.windowsappsdk`
- copy `lib\win10-x64` thành `lib\win10-` để chặn lỗi linker path rỗng
- patch các file `.targets/.props` của WindowsAppSDK để `win10-$(...)` thành `win10-x64`

Không sửa Android, không sửa app id/package Android, không sửa backend/OAuth.

Chạy:

```powershell
node apply_windows_bootstrap_fix_v2.js
npm run windows:clean
npm run windows
```

Nếu vẫn lỗi:

```powershell
npm run windows:logging
```
