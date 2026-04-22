const fs = require('fs');
const path = require('path');
const os = require('os');

const root = process.cwd();

function log(...args) {
  console.log('[Aplus Windows x64 fix]', ...args);
}

function warn(...args) {
  console.warn('[Aplus Windows x64 fix][warn]', ...args);
}

function write(file, content) {
  const p = path.join(root, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content.trimStart().replace(/\n/g, '\r\n'), 'utf8');
  log('write', file);
}

function safeRm(p) {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
    log('removed', path.relative(root, p));
  }
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const item of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, item.name);
    const d = path.join(dst, item.name);
    if (item.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function collectFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(p, out);
    else out.push(p);
  }
  return out;
}

function compareVersionLike(a, b) {
  const pa = a.split(/[^\d]+/).filter(Boolean).map(Number);
  const pb = b.split(/[^\d]+/).filter(Boolean).map(Number);
  const n = Math.max(pa.length, pb.length);
  for (let i = 0; i < n; i++) {
    const da = pa[i] || 0;
    const db = pb[i] || 0;
    if (da !== db) return da - db;
  }
  return a.localeCompare(b);
}

function patchPackageScripts() {
  const pkgPath = path.join(root, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    warn('package.json not found');
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.scripts = pkg.scripts || {};

  pkg.scripts['windows:prep'] = 'node scripts/patch-windows-build-x64.js';
  pkg.scripts.windows = 'npm run windows:prep && react-native run-windows --arch x64';
  pkg.scripts['windows:release'] = 'npm run windows:prep && react-native run-windows --release --arch x64';
  pkg.scripts['windows:logging'] = 'npm run windows:prep && react-native run-windows --arch x64 --logging';
  pkg.scripts['windows:deepclean'] =
    'powershell -NoProfile -ExecutionPolicy Bypass -Command "Remove-Item -Recurse -Force windows\\\\.vs,windows\\\\x64,windows\\\\Win32,node_modules\\\\react-native-windows\\\\build,node_modules\\\\react-native-windows\\\\target,node_modules\\\\@react-native-async-storage\\\\async-storage\\\\windows\\\\build,node_modules\\\\@react-native-async-storage\\\\async-storage\\\\windows\\\\target,node_modules\\\\@react-native-async-storage\\\\async-storage\\\\windows\\\\x64,node_modules\\\\@react-native-async-storage\\\\async-storage\\\\windows\\\\Win32,node_modules\\\\@react-native-community\\\\netinfo\\\\windows\\\\build,node_modules\\\\@react-native-community\\\\netinfo\\\\windows\\\\target,node_modules\\\\@react-native-community\\\\netinfo\\\\windows\\\\x64,node_modules\\\\@react-native-community\\\\netinfo\\\\windows\\\\Win32,node_modules\\\\react-native-device-info\\\\windows\\\\build,node_modules\\\\react-native-device-info\\\\windows\\\\target,node_modules\\\\react-native-device-info\\\\windows\\\\x64,node_modules\\\\react-native-device-info\\\\windows\\\\Win32,node_modules\\\\react-native-screens\\\\windows\\\\build,node_modules\\\\react-native-screens\\\\windows\\\\target,node_modules\\\\react-native-screens\\\\windows\\\\x64,node_modules\\\\react-native-screens\\\\windows\\\\Win32 -ErrorAction SilentlyContinue"';

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  log('patched package.json Windows scripts');
}

function patchWinAppSdkBootstrap() {
  const sdkRoot = path.join(process.env.USERPROFILE || os.homedir(), '.nuget', 'packages', 'microsoft.windowsappsdk');
  if (!fs.existsSync(sdkRoot)) {
    warn('Microsoft.WindowsAppSDK NuGet package not found yet; it will be patched after first restore');
    return;
  }

  const versions = fs.readdirSync(sdkRoot)
    .filter(v => fs.existsSync(path.join(sdkRoot, v)))
    .sort(compareVersionLike);

  for (const version of versions) {
    const versionDir = path.join(sdkRoot, version);
    const src = path.join(versionDir, 'lib', 'win10-x64');
    const dst = path.join(versionDir, 'lib', 'win10-');
    if (fs.existsSync(src)) {
      copyDir(src, dst);
      log(`WinAppSDK ${version}: copied lib\\win10-x64 -> lib\\win10-`);
    }

    const targetFiles = collectFiles(versionDir)
      .filter(f => /\.(targets|props)$/i.test(f));

    let count = 0;
    for (const f of targetFiles) {
      let s = fs.readFileSync(f, 'utf8');
      const old = s;
      s = s.replace(/win10-\$\([^)]+\)/g, 'win10-x64');
      s = s.replace(/lib\\win10-\\Microsoft\.WindowsAppRuntime\.Bootstrap\.lib/g,
        'lib\\win10-x64\\Microsoft.WindowsAppRuntime.Bootstrap.lib');
      s = s.replace(/lib\/win10-\/Microsoft\.WindowsAppRuntime\.Bootstrap\.lib/g,
        'lib/win10-x64/Microsoft.WindowsAppRuntime.Bootstrap.lib');
      if (s !== old) {
        fs.writeFileSync(f, s, 'utf8');
        count++;
      }
    }
    log(`WinAppSDK ${version}: patched ${count} props/targets files`);
  }
}

function patchSolutionMappings() {
  const windowsDir = path.join(root, 'windows');
  if (!fs.existsSync(windowsDir)) {
    warn('windows directory not found');
    return;
  }

  const slnFiles = collectFiles(windowsDir).filter(f => f.toLowerCase().endsWith('.sln'));
  if (!slnFiles.length) {
    warn('no .sln file found under windows');
    return;
  }

  for (const sln of slnFiles) {
    let s = fs.readFileSync(sln, 'utf8');
    const old = s;

    // Main fix for the current log:
    // Solution is Debug|x64, but native dependency projects are still mapped to Debug|Win32.
    // That builds Microsoft.ReactNative.dll as x86 while the app/dependencies are AMD64.
    s = s.replace(/(\.Debug\|x64\.ActiveCfg\s*=\s*)Debug\|Win32/g, '$1Debug|x64');
    s = s.replace(/(\.Debug\|x64\.Build\.0\s*=\s*)Debug\|Win32/g, '$1Debug|x64');
    s = s.replace(/(\.Release\|x64\.ActiveCfg\s*=\s*)Release\|Win32/g, '$1Release|x64');
    s = s.replace(/(\.Release\|x64\.Build\.0\s*=\s*)Release\|Win32/g, '$1Release|x64');

    // If a generator put Any CPU for C++ projects in x64 solution config, force it to x64 too.
    s = s.replace(/(\.Debug\|x64\.ActiveCfg\s*=\s*)Debug\|Any CPU/g, '$1Debug|x64');
    s = s.replace(/(\.Debug\|x64\.Build\.0\s*=\s*)Debug\|Any CPU/g, '$1Debug|x64');
    s = s.replace(/(\.Release\|x64\.ActiveCfg\s*=\s*)Release\|Any CPU/g, '$1Release|x64');
    s = s.replace(/(\.Release\|x64\.Build\.0\s*=\s*)Release\|Any CPU/g, '$1Release|x64');

    if (s !== old) {
      fs.writeFileSync(sln, s, 'utf8');
      const win32Left = (s.match(/\.Debug\|x64\.(ActiveCfg|Build\.0)\s*=\s*Debug\|Win32/g) || []).length
        + (s.match(/\.Release\|x64\.(ActiveCfg|Build\.0)\s*=\s*Release\|Win32/g) || []).length;
      log(`patched solution x64 mappings: ${path.relative(root, sln)}; remaining x64->Win32 mappings: ${win32Left}`);
    } else {
      log(`solution already has no x64->Win32 mappings: ${path.relative(root, sln)}`);
    }
  }
}

function patchGeneratedAutolinkIfNeeded() {
  const files = collectFiles(path.join(root, 'windows'))
    .filter(f => /\.(props|targets|vcxproj)$/i.test(f));

  let patched = 0;
  for (const f of files) {
    let s = fs.readFileSync(f, 'utf8');
    const old = s;

    // Some generated ProjectReference metadata can force Win32 even when solution is x64.
    // Do not touch general Win32 configurations; only ProjectReference metadata / SetPlatform.
    s = s.replace(/SetPlatform=Win32/g, 'SetPlatform=x64');
    s = s.replace(/<SetPlatform>Win32<\/SetPlatform>/g, '<SetPlatform>x64</SetPlatform>');

    if (s !== old) {
      fs.writeFileSync(f, s, 'utf8');
      patched++;
      log(`patched generated platform hint: ${path.relative(root, f)}`);
    }
  }

  if (!patched) log('no generated SetPlatform=Win32 hints found under windows');
}

function ensureDirectoryBuildFiles() {
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
  <Target Name="AplusPrintWindowsBuildArch" BeforeTargets="PrepareForBuild">
    <Message Importance="High" Text="[Aplus Windows] MSBuild project=$(MSBuildProjectName); Platform=$(Platform); PlatformTarget=$(PlatformTarget); ProcessorArchitecture=$(ProcessorArchitecture)" />
  </Target>
</Project>
`);
}

function deepCleanNow() {
  const paths = [
    'windows/.vs',
    'windows/x64',
    'windows/Win32',
    'node_modules/react-native-windows/build',
    'node_modules/react-native-windows/target',
    'node_modules/@react-native-async-storage/async-storage/windows/build',
    'node_modules/@react-native-async-storage/async-storage/windows/target',
    'node_modules/@react-native-async-storage/async-storage/windows/x64',
    'node_modules/@react-native-async-storage/async-storage/windows/Win32',
    'node_modules/@react-native-community/netinfo/windows/build',
    'node_modules/@react-native-community/netinfo/windows/target',
    'node_modules/@react-native-community/netinfo/windows/x64',
    'node_modules/@react-native-community/netinfo/windows/Win32',
    'node_modules/react-native-device-info/windows/build',
    'node_modules/react-native-device-info/windows/target',
    'node_modules/react-native-device-info/windows/x64',
    'node_modules/react-native-device-info/windows/Win32',
    'node_modules/react-native-screens/windows/build',
    'node_modules/react-native-screens/windows/target',
    'node_modules/react-native-screens/windows/x64',
    'node_modules/react-native-screens/windows/Win32',
  ];

  for (const rel of paths) safeRm(path.join(root, rel));
}

function writeNotes() {
  write('WINDOWS_ARCH_FIX_V3_NOTES.md', `
# Aplus Windows arch fix v3

Log mới đã qua lỗi Bootstrap.lib, nhưng fail ở:

\`\`\`
MSB3271: project being built "AMD64" nhưng implementation file Microsoft.ReactNative.dll là "x86"
\`\`\`

Nguyên nhân: solution đang build \`Debug|x64\`, nhưng một số native dependency project trong \`.sln\`
vẫn map \`Debug|x64 -> Debug|Win32\`. Vì vậy \`Microsoft.ReactNative.dll\` bị build ra x86,
trong khi AsyncStorage/app đang build AMD64.

Patch này:
- sửa \`windows/*.sln\` để \`Debug|x64\` và \`Release|x64\` map đúng sang \`x64\`, không sang \`Win32\`
- giữ fix WindowsAppSDK \`win10-\` của v2
- thêm clean sâu các output x86 cũ trong \`node_modules/react-native-windows/target\`
- không sửa Android, không sửa backend/OAuth, không sửa logic gameplay

Chạy:

\`\`\`powershell
node apply_windows_arch_fix_v3.js
npm run windows:deepclean
npm run windows
\`\`\`

Nếu vẫn lỗi:

\`\`\`powershell
npm run windows:logging
\`\`\`

Trong log mới cần nhìn dòng:
\`\`\`
[Aplus Windows] MSBuild project=Microsoft.ReactNative; Platform=x64; PlatformTarget=x64
\`\`\`

Không được còn:
\`\`\`
Platform=Win32; PlatformTarget=x86
\`\`\`
cho \`Microsoft.ReactNative\`, \`Common\`, \`Folly\`.
`);
}

patchPackageScripts();
ensureDirectoryBuildFiles();
write('scripts/patch-windows-build-x64.js', fs.readFileSync(__filename, 'utf8').replace(/patchPackageScripts\(\);[\s\S]*$/, `
patchWinAppSdkBootstrap();
patchSolutionMappings();
patchGeneratedAutolinkIfNeeded();
log('prep done');
`));
patchWinAppSdkBootstrap();
patchSolutionMappings();
patchGeneratedAutolinkIfNeeded();
deepCleanNow();
writeNotes();

log('done. Now run: npm run windows:deepclean && npm run windows');
