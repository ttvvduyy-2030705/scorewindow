# Aplus Score Windows fallback patch

Đã thêm fallback Windows để ưu tiên build được app và vào được gameplay.

## Windows dùng fallback
- Camera/VisionCamera: `src/components/Video/index.windows.tsx`
- Webcam/FFmpeg/livestream/replay native: `WebCamViewModel.windows.tsx`, `playback/index.windows.tsx`
- Realm/history: `App.windows.tsx`, `history/index.windows.tsx`, `sagas/*.windows.tsx`
- Google Sign-In/livestream config: `configs/index.windows.tsx`, `configs.windows.tsx`
- Bluetooth remote/sound/permission Android: `remote.windows.tsx`, `sound.windows.tsx`, `permission.windows.tsx`
- LinearGradient: `View/index.windows.tsx`, `Button/index.windows.tsx`, `home/index.windows.tsx`

## Android
Android vẫn dùng các file gốc `.tsx`. Các file `.windows.tsx` chỉ được Metro/RNW dùng khi build Windows.
