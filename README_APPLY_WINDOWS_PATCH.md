# Cách áp patch Windows cho Aplus Score / billiardsgrade

1. Giải nén file này vào thư mục bất kỳ.
2. Copy `apply_windows_patch.js` vào root repo `scorewindow` / `billiardsgrade`.
3. Ở root repo, chạy:

```bash
node apply_windows_patch.js
npm install
npx react-native init-windows --overwrite --template cpp-app --name billiardsgrade --namespace BilliardsGrade
npm run windows
```

Nếu máy yêu cầu autolink:

```bash
npm run windows:autolink
npm run windows
```

Build release Windows:

```bash
npm run windows:release
```

Patch này ưu tiên: build Windows, mở app, vào gameplay. Camera/livestream/replay/Bluetooth/Realm history được fallback/disable trên Windows để không crash. Android vẫn dùng file gốc.
