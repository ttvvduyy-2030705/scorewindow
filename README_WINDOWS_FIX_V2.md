# Windows build fix v2

This small patch updates only the Windows build guard files and prep script.

Changes:
- Forces `PlatformToolset=v143` for `.vcxproj` projects when MSBuild did not set it.
- Keeps x64 platform target and x64 preferred tool architecture.
- Fixes `Directory.Build.props` output paths.
- Adds diagnostic output for `PlatformToolset`.
- Warns when Visual Studio MSIX/DesktopBridge packaging tools are missing.

It does not modify UI, gameplay, camera, livestream, overlay, Android, or iOS.
