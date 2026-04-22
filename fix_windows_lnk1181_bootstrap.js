const fs = require('fs');
const path = require('path');

const root = process.cwd();

function write(file, content) {
  const p = path.join(root, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content.trimStart().replace(/\n/g, '\r\n'), 'utf8');
  console.log('[write]', file);
}

function patchPackageJson() {
  const p = path.join(root, 'package.json');
  if (!fs.existsSync(p)) {
    console.warn('[skip] package.json not found');
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
  pkg.scripts = pkg.scripts || {};

  // Force x64 so the generated Windows build config and package lib path keep the CPU architecture.
  pkg.scripts.windows = 'react-native run-windows --arch x64';
  pkg.scripts['windows:release'] = 'react-native run-windows --release --arch x64';
  pkg.scripts['windows:logging'] = 'react-native run-windows --arch x64 --logging';
  pkg.scripts['windows:clean'] =
    'powershell -NoProfile -ExecutionPolicy Bypass -Command "Remove-Item -Recurse -Force windows\\\\.vs,windows\\\\x64,node_modules\\\\react-native-windows\\\\Microsoft.ReactNative\\\\x64 -ErrorAction SilentlyContinue"';

  fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  console.log('[patch] package.json scripts.windows -> --arch x64');
}

patchPackageJson();

/*
  Fix for:
  LINK : fatal error LNK1181:
  ...\\microsoft.windowsappsdk\\...\\lib\\win10-\\Microsoft.WindowsAppRuntime.Bootstrap.lib

  The WindowsAppSDK NuGet target needs PlatformTarget to resolve:
    lib\\win10-x64\\Microsoft.WindowsAppRuntime.Bootstrap.lib

  Some React Native Windows/MSBuild combinations build with Platform=x64
  but leave PlatformTarget empty inside transitive C++ projects such as
  node_modules\\react-native-windows\\Microsoft.ReactNative\\Microsoft.ReactNative.vcxproj.

  Directory.Build.props is imported by MSBuild for the app project AND for
  node_modules/react-native-windows projects because MSBuild walks up to repo root.
  This does not affect Android.
*/
write('Directory.Build.props', `
<Project>
  <PropertyGroup>
    <PlatformTarget Condition="'$(PlatformTarget)' == '' and '$(Platform)' == 'x64'">x64</PlatformTarget>
    <PlatformTarget Condition="'$(PlatformTarget)' == '' and '$(Platform)' == 'Win32'">x86</PlatformTarget>
    <PlatformTarget Condition="'$(PlatformTarget)' == '' and '$(Platform)' == 'ARM64'">ARM64</PlatformTarget>
    <PlatformTarget Condition="'$(PlatformTarget)' == '' and '$(Platform)' == 'ARM'">ARM</PlatformTarget>
  </PropertyGroup>
</Project>
`);

write('Directory.Build.targets', `
<Project>
  <PropertyGroup>
    <PlatformTarget Condition="'$(PlatformTarget)' == '' and '$(Platform)' == 'x64'">x64</PlatformTarget>
    <PlatformTarget Condition="'$(PlatformTarget)' == '' and '$(Platform)' == 'Win32'">x86</PlatformTarget>
    <PlatformTarget Condition="'$(PlatformTarget)' == '' and '$(Platform)' == 'ARM64'">ARM64</PlatformTarget>
    <PlatformTarget Condition="'$(PlatformTarget)' == '' and '$(Platform)' == 'ARM'">ARM</PlatformTarget>
  </PropertyGroup>

  <Target Name="AplusPrintWindowsBuildArch" BeforeTargets="PrepareForBuild">
    <Message Importance="High" Text="[Aplus Windows] Platform=$(Platform); PlatformTarget=$(PlatformTarget)" />
  </Target>
</Project>
`);

write('WINDOWS_LNK1181_FIX_NOTES.md', `
# Fix lỗi Windows LNK1181 Bootstrap.lib

Lỗi:
\`\`\`
LINK : fatal error LNK1181:
cannot open input file ...\\microsoft.windowsappsdk\\1.5.240227000\\...\\lib\\win10-\\Microsoft.WindowsAppRuntime.Bootstrap.lib
\`\`\`

Nguyên nhân: MSBuild/NuGet đang sinh đường dẫn \`win10-\` bị thiếu kiến trúc CPU. Đúng ra với máy x64 phải là:
\`\`\`
lib\\win10-x64\\Microsoft.WindowsAppRuntime.Bootstrap.lib
\`\`\`

Patch này:
- ép script Windows chạy với \`--arch x64\`
- thêm \`Directory.Build.props\`
- thêm \`Directory.Build.targets\`
- set \`PlatformTarget=x64\` khi \`Platform=x64\`
- không sửa Android package/app id/backend/OAuth
- không động vào logic gameplay Android

Chạy:
\`\`\`powershell
node fix_windows_lnk1181_bootstrap.js
npm run windows:clean
npm run windows
\`\`\`

Nếu vẫn lỗi, chạy bản log:
\`\`\`powershell
npm run windows:logging
\`\`\`
`);
