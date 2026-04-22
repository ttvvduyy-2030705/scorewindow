const fs = require('fs');
const path = require('path');
const os = require('os');

const root = process.cwd();

function log(...args) {
  console.log('[Aplus WinAppSDK fix]', ...args);
}

function warn(...args) {
  console.warn('[Aplus WinAppSDK fix][warn]', ...args);
}

function write(file, content) {
  const p = path.join(root, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content.trimStart().replace(/\n/g, '\r\n'), 'utf8');
  log('write', file);
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const item of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, item.name);
    const d = path.join(dst, item.name);
    if (item.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

function patchPackageScripts() {
  const pkgPath = path.join(root, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    warn('package.json not found, skip scripts patch');
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['windows:prep'] = 'node scripts/patch-winappsdk-bootstrap-x64.js';
  pkg.scripts.windows = 'npm run windows:prep && react-native run-windows --arch x64';
  pkg.scripts['windows:release'] = 'npm run windows:prep && react-native run-windows --release --arch x64';
  pkg.scripts['windows:logging'] = 'npm run windows:prep && react-native run-windows --arch x64 --logging';
  pkg.scripts['windows:clean'] =
    'powershell -NoProfile -ExecutionPolicy Bypass -Command "Remove-Item -Recurse -Force windows\\\\.vs,windows\\\\x64,node_modules\\\\react-native-windows\\\\build,node_modules\\\\react-native-windows\\\\target,node_modules\\\\react-native-windows\\\\Microsoft.ReactNative\\\\x64 -ErrorAction SilentlyContinue"';

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  log('patched package.json Windows scripts');
}

function getNugetPackageRoot() {
  const candidates = [
    path.join(process.env.USERPROFILE || '', '.nuget', 'packages', 'microsoft.windowsappsdk'),
    path.join(os.homedir(), '.nuget', 'packages', 'microsoft.windowsappsdk'),
  ].filter(Boolean);

  return candidates.find(p => fs.existsSync(p));
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

function collectFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(p, out);
    else out.push(p);
  }
  return out;
}

function patchOneWindowsAppSdkVersion(versionDir) {
  const version = path.basename(versionDir);
  const libRoot = path.join(versionDir, 'lib');
  const srcArchDir = path.join(libRoot, 'win10-x64');
  const blankArchDir = path.join(libRoot, 'win10-');

  if (fs.existsSync(srcArchDir)) {
    copyDir(srcArchDir, blankArchDir);
    log(`created fallback lib folder for ${version}: lib\\win10- -> lib\\win10-x64`);
  } else {
    const existing = fs.existsSync(libRoot)
      ? fs.readdirSync(libRoot).filter(x => x.toLowerCase().startsWith('win10-')).join(', ')
      : '(no lib folder)';
    warn(`cannot find lib\\win10-x64 in WindowsAppSDK ${version}. Existing arch folders: ${existing}`);
  }

  const buildRoots = [
    path.join(versionDir, 'buildTransitive'),
    path.join(versionDir, 'build'),
  ];

  let patchedFiles = 0;
  for (const buildRoot of buildRoots) {
    const files = collectFiles(buildRoot).filter(f => /\.(targets|props)$/i.test(f));
    for (const file of files) {
      let text = fs.readFileSync(file, 'utf8');
      const original = text;

      // Work around the RNW/WindowsAppSDK bug where MSBuild produces:
      // lib\win10-\Microsoft.WindowsAppRuntime.Bootstrap.lib
      // instead of:
      // lib\win10-x64\Microsoft.WindowsAppRuntime.Bootstrap.lib
      text = text.replace(/win10-\$\([^)]+\)/g, 'win10-x64');
      text = text.replace(/win10-\$\(.*?\)/g, 'win10-x64');

      // Extra guard if a previous bad expansion or generated file already has win10- literal.
      text = text.replace(/lib\\win10-\\Microsoft\.WindowsAppRuntime\.Bootstrap\.lib/g,
        'lib\\win10-x64\\Microsoft.WindowsAppRuntime.Bootstrap.lib');
      text = text.replace(/lib\/win10-\/Microsoft\.WindowsAppRuntime\.Bootstrap\.lib/g,
        'lib/win10-x64/Microsoft.WindowsAppRuntime.Bootstrap.lib');

      if (text !== original) {
        fs.writeFileSync(file, text, 'utf8');
        patchedFiles++;
        log(`patched ${path.relative(versionDir, file)}`);
      }
    }
  }

  if (patchedFiles === 0) {
    log(`no target text replacement needed for WindowsAppSDK ${version}; fallback folder still created if possible`);
  }
}

function patchNugetWindowsAppSdk() {
  const sdkRoot = getNugetPackageRoot();

  if (!sdkRoot) {
    warn('Microsoft.WindowsAppSDK NuGet package is not restored yet.');
    warn('Run once: npm run windows');
    warn('Then run again: npm run windows');
    return;
  }

  const versions = fs.readdirSync(sdkRoot)
    .filter(v => fs.existsSync(path.join(sdkRoot, v)))
    .sort(compareVersionLike);

  if (!versions.length) {
    warn(`No Microsoft.WindowsAppSDK versions found in ${sdkRoot}`);
    return;
  }

  log(`found Microsoft.WindowsAppSDK versions: ${versions.join(', ')}`);
  for (const v of versions) {
    patchOneWindowsAppSdkVersion(path.join(sdkRoot, v));
  }
}

function ensureDirectoryBuildProps() {
  write('Directory.Build.props', `
<Project>
  <PropertyGroup>
    <PlatformTarget Condition="'$(PlatformTarget)' == '' and '$(Platform)' == 'x64'">x64</PlatformTarget>
    <PlatformTarget Condition="'$(PlatformTarget)' == '' and '$(Platform)' == 'Win32'">x86</PlatformTarget>
    <PlatformTarget Condition="'$(PlatformTarget)' == '' and '$(Platform)' == 'ARM64'">ARM64</PlatformTarget>
    <PlatformTarget Condition="'$(PlatformTarget)' == '' and '$(Platform)' == 'ARM'">ARM</PlatformTarget>

    <AplusWinAppSdkArch Condition="'$(AplusWinAppSdkArch)' == '' and '$(Platform)' == 'x64'">x64</AplusWinAppSdkArch>
    <AplusWinAppSdkArch Condition="'$(AplusWinAppSdkArch)' == '' and '$(PlatformTarget)' != ''">$(PlatformTarget)</AplusWinAppSdkArch>
    <AplusWinAppSdkArch Condition="'$(AplusWinAppSdkArch)' == ''">x64</AplusWinAppSdkArch>
  </PropertyGroup>
</Project>
`);
}

function ensureNotes() {
  write('WINDOWS_BOOTSTRAP_FIX_V2_NOTES.md', `
# Aplus Windows Bootstrap.lib fix v2

Log hiện tại cho thấy môi trường RNW đã OK, nhưng WindowsAppSDK/RNW sinh sai đường dẫn:

\`\`\`
lib\\win10-\\Microsoft.WindowsAppRuntime.Bootstrap.lib
\`\`\`

Đúng với build x64 phải là:

\`\`\`
lib\\win10-x64\\Microsoft.WindowsAppRuntime.Bootstrap.lib
\`\`\`

Patch này làm 2 việc:

1. Thêm \`scripts/patch-winappsdk-bootstrap-x64.js\`
2. Sửa scripts trong \`package.json\` để trước mỗi lần \`npm run windows\` luôn chạy:
   \`\`\`
   npm run windows:prep
   \`\`\`

\`windows:prep\` sẽ:
- tìm \`%USERPROFILE%\\.nuget\\packages\\microsoft.windowsappsdk\`
- copy \`lib\\win10-x64\` thành \`lib\\win10-\` để chặn lỗi linker path rỗng
- patch các file \`.targets/.props\` của WindowsAppSDK để \`win10-$(...)\` thành \`win10-x64\`

Không sửa Android, không sửa app id/package Android, không sửa backend/OAuth.

Chạy:

\`\`\`powershell
node apply_windows_bootstrap_fix_v2.js
npm run windows:clean
npm run windows
\`\`\`

Nếu vẫn lỗi:

\`\`\`powershell
npm run windows:logging
\`\`\`
`);
}

patchPackageScripts();
ensureDirectoryBuildProps();

// The patch script itself must exist in repo before patching package cache.
write('scripts/patch-winappsdk-bootstrap-x64.js', fs.readFileSync(__filename, 'utf8')
  .replace(/patchPackageScripts\(\);\s*ensureDirectoryBuildProps\(\);\s*\/\/ The patch script itself must exist in repo before patching package cache\.[\s\S]*$/, `
patchNugetWindowsAppSdk();
log('done');
`));

patchNugetWindowsAppSdk();
ensureNotes();

log('done. Now run: npm run windows:clean && npm run windows');
