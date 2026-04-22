const fs = require('fs');
const path = require('path');
const os = require('os');

const root = process.cwd();

function log(...args) {
  console.log('[Aplus Windows x64 prep]', ...args);
}
function warn(...args) {
  console.warn('[Aplus Windows x64 prep][warn]', ...args);
}
function exists(file) {
  return fs.existsSync(file);
}
function read(file) {
  return fs.readFileSync(file, 'utf8');
}
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}
function safeRm(relPath) {
  const p = path.join(root, relPath);
  if (exists(p)) {
    fs.rmSync(p, { recursive: true, force: true });
    log('removed', relPath);
  }
}
function walk(dir, out = []) {
  if (!exists(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
function compareVersionLike(a, b) {
  const pa = a.split(/[^\d]+/).filter(Boolean).map(Number);
  const pb = b.split(/[^\d]+/).filter(Boolean).map(Number);
  const n = Math.max(pa.length, pb.length);
  for (let i = 0; i < n; i += 1) {
    const da = pa[i] || 0;
    const db = pb[i] || 0;
    if (da !== db) return da - db;
  }
  return a.localeCompare(b);
}
function copyDir(src, dst) {
  if (!exists(src)) return false;
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
  return true;
}

function patchPackageJson() {
  const file = path.join(root, 'package.json');
  if (!exists(file)) {
    warn('package.json not found');
    return;
  }
  const pkg = JSON.parse(read(file));
  pkg.dependencies = pkg.dependencies || {};
  pkg.devDependencies = pkg.devDependencies || {};
  pkg.scripts = pkg.scripts || {};
  pkg.dependencies['react-native-windows'] = pkg.dependencies['react-native-windows'] || '~0.75.0';
  pkg.devDependencies['@rnx-kit/jest-preset'] = pkg.devDependencies['@rnx-kit/jest-preset'] || '^0.1.17';
  pkg.scripts.windows = 'npm run windows:prep && react-native run-windows --arch x64';
  pkg.scripts['windows:logging'] = 'npm run windows:prep && react-native run-windows --arch x64 --logging';
  pkg.scripts['windows:release'] = 'npm run windows:prep && react-native run-windows --release --arch x64';
  pkg.scripts['windows:autolink'] = 'react-native autolink-windows';
  pkg.scripts['windows:prep'] = 'node scripts/patch-windows-build-x64.js';
  pkg.scripts['windows:deepclean'] = 'powershell -NoProfile -ExecutionPolicy Bypass -Command "Remove-Item -Recurse -Force windows\\.vs,windows\\x64,windows\\Win32,windows\\Debug,windows\\Release,\"windows\\Generated Files\",windows\\packages,node_modules\\react-native-windows\\build,node_modules\\react-native-windows\\target,node_modules\\react-native-windows\\Microsoft.ReactNative\\x64,node_modules\\react-native-windows\\Microsoft.ReactNative\\Win32,node_modules\\@react-native-async-storage\\async-storage\\windows\\build,node_modules\\@react-native-async-storage\\async-storage\\windows\\target,node_modules\\@react-native-community\\netinfo\\windows\\build,node_modules\\@react-native-community\\netinfo\\windows\\target,node_modules\\react-native-device-info\\windows\\build,node_modules\\react-native-device-info\\windows\\target,node_modules\\react-native-screens\\windows\\build,node_modules\\react-native-screens\\windows\\target -ErrorAction SilentlyContinue"';
  write(file, `${JSON.stringify(pkg, null, 2)}\n`);
  log('patched package.json Windows scripts/dependencies');
}

function writeBuildGuards() {
  write(path.join(root, 'Directory.Build.props'), `<?xml version="1.0" encoding="utf-8"?>
<Project>
  <PropertyGroup>
    <Configuration Condition="'$(Configuration)' == ''">Debug</Configuration>
    <Platform Condition="'$(Platform)' == ''">x64</Platform>
    <PreferredToolArchitecture>x64</PreferredToolArchitecture>
    <PlatformTarget Condition="'$(Platform)' == 'x64'">x64</PlatformTarget>
    <PlatformTarget Condition="'$(Platform)' == 'ARM64'">ARM64</PlatformTarget>
    <PlatformTarget Condition="'$(Platform)' == 'Win32' or '$(Platform)' == 'x86'">x86</PlatformTarget>
  </PropertyGroup>

  <!-- Native C++ projects in RNW must have PlatformToolset set. If VS project props do not set it,
       force the VS 2022 toolset to avoid MSB8003: PlatformToolset property is not defined. -->
  <PropertyGroup Condition="'$(MSBuildProjectExtension)' == '.vcxproj'">
    <PlatformToolset Condition="'$(PlatformToolset)' == ''">v143</PlatformToolset>
    <IntDir Condition="'$(IntDir)' == '' and '$(Configuration)' != '' and '$(Platform)' != ''">$(MSBuildProjectDirectory)\\obj\\$(Platform)\\$(Configuration)\\$(MSBuildProjectName)\\</IntDir>
    <OutDir Condition="'$(OutDir)' == '' and '$(Configuration)' != '' and '$(Platform)' != ''">$(MSBuildProjectDirectory)\\bin\\$(Platform)\\$(Configuration)\\</OutDir>
  </PropertyGroup>
</Project>
`);

  write(path.join(root, 'Directory.Build.targets'), `<?xml version="1.0" encoding="utf-8"?>
<Project>
  <Target Name="AplusWindowsBuildDiagnostics" BeforeTargets="PrepareForBuild" Condition="'$(MSBuildProjectExtension)' == '.vcxproj'">
    <Message Importance="High" Text="[Aplus Windows] Project=$(MSBuildProjectName); Configuration=$(Configuration); Platform=$(Platform); PlatformTarget=$(PlatformTarget); PlatformToolset=$(PlatformToolset); PreferredToolArchitecture=$(PreferredToolArchitecture); IntDir=$(IntDir); OutDir=$(OutDir)" />
  </Target>
</Project>
`);
  log('wrote Directory.Build.props/targets with v143 PlatformToolset guard');
}

function patchSolutionMappings() {
  const roots = [path.join(root, 'windows'), path.join(root, 'node_modules', 'react-native-windows')];
  let patched = 0;
  for (const folder of roots) {
    for (const file of walk(folder).filter(f => f.toLowerCase().endsWith('.sln'))) {
      let s = read(file);
      const before = s;
      s = s.replace(/(\.Debug\|x64\.(?:ActiveCfg|Build\.0|Deploy\.0)\s*=\s*)Debug\|Win32/g, '$1Debug|x64');
      s = s.replace(/(\.Release\|x64\.(?:ActiveCfg|Build\.0|Deploy\.0)\s*=\s*)Release\|Win32/g, '$1Release|x64');
      s = s.replace(/(\.Debug\|x64\.(?:ActiveCfg|Build\.0|Deploy\.0)\s*=\s*)Debug\|x86/g, '$1Debug|x64');
      s = s.replace(/(\.Release\|x64\.(?:ActiveCfg|Build\.0|Deploy\.0)\s*=\s*)Release\|x86/g, '$1Release|x64');
      s = s.replace(/(\.Debug\|x64\.(?:ActiveCfg|Build\.0|Deploy\.0)\s*=\s*)Debug\|Any CPU/g, '$1Debug|x64');
      s = s.replace(/(\.Release\|x64\.(?:ActiveCfg|Build\.0|Deploy\.0)\s*=\s*)Release\|Any CPU/g, '$1Release|x64');
      if (s !== before) {
        write(file, s);
        patched += 1;
        log('patched solution mapping:', path.relative(root, file));
      }
    }
  }
  if (!patched) log('solution x64 mappings already clean');
}

function patchProjectPlatformHints() {
  const roots = [
    path.join(root, 'windows'),
    path.join(root, 'node_modules', 'react-native-windows'),
    path.join(root, 'node_modules', '@react-native-async-storage', 'async-storage', 'windows'),
    path.join(root, 'node_modules', '@react-native-community', 'netinfo', 'windows'),
    path.join(root, 'node_modules', 'react-native-device-info', 'windows'),
    path.join(root, 'node_modules', 'react-native-screens', 'windows'),
  ];
  let patched = 0;
  for (const folder of roots) {
    for (const file of walk(folder).filter(f => /\.(vcxproj|props|targets)$/i.test(f))) {
      let s = read(file);
      const before = s;
      s = s.replace(/SetPlatform=Win32/g, 'SetPlatform=x64');
      s = s.replace(/<SetPlatform>Win32<\/SetPlatform>/g, '<SetPlatform>x64</SetPlatform>');
      s = s.replace(/%(AdditionalDependenices)/g, '%(AdditionalDependencies)');
      if (/\.vcxproj$/i.test(file) && !s.includes('AplusForceX64NativeBuild')) {
        s = s.replace(/(<PropertyGroup\s+Label="Globals">)/, '$1\n    <AplusForceX64NativeBuild>true</AplusForceX64NativeBuild>');
        s = s.replace(/(<Import Project="\$\(VCTargetsPath\)\\Microsoft\.Cpp\.props"\s*\/?>)/, '$1\n  <PropertyGroup Condition="\'$(Platform)\'==\'x64\'">\n    <PreferredToolArchitecture>x64</PreferredToolArchitecture>\n    <PlatformTarget>x64</PlatformTarget>\n    <PlatformToolset Condition="\'$(PlatformToolset)\'==\'\'">v143</PlatformToolset>\n  </PropertyGroup>');
      }
      if (s !== before) {
        write(file, s);
        patched += 1;
        log('patched project platform hints:', path.relative(root, file));
      }
    }
  }
  if (!patched) log('no project platform hints needed patching');
}

function patchWindowsAppSdkBootstrap() {
  const sdkRoot = path.join(process.env.USERPROFILE || os.homedir(), '.nuget', 'packages', 'microsoft.windowsappsdk');
  if (!exists(sdkRoot)) {
    warn('Microsoft.WindowsAppSDK NuGet package not restored yet');
    return;
  }
  for (const version of fs.readdirSync(sdkRoot).sort(compareVersionLike)) {
    const versionDir = path.join(sdkRoot, version);
    const src = path.join(versionDir, 'lib', 'win10-x64');
    const dst = path.join(versionDir, 'lib', 'win10-');
    if (copyDir(src, dst)) log(`WinAppSDK ${version}: copied lib\\win10-x64 -> lib\\win10-`);
    let count = 0;
    for (const file of walk(versionDir).filter(f => /\.(props|targets)$/i.test(f))) {
      let s = read(file);
      const before = s;
      s = s.replace(/win10-\$\([^)]+\)/g, 'win10-x64');
      s = s.replace(/lib\\win10-\\Microsoft\.WindowsAppRuntime\.Bootstrap\.lib/g, 'lib\\win10-x64\\Microsoft.WindowsAppRuntime.Bootstrap.lib');
      s = s.replace(/lib\/win10-\/Microsoft\.WindowsAppRuntime\.Bootstrap\.lib/g, 'lib/win10-x64/Microsoft.WindowsAppRuntime.Bootstrap.lib');
      if (s !== before) {
        write(file, s);
        count += 1;
      }
    }
    if (count) log(`WinAppSDK ${version}: patched ${count} props/targets files`);
  }
}

function checkVisualStudioPackagingTools() {
  const vsInstall = process.env.VSINSTALLDIR || 'C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\';
  const desktopBridgeProps = path.join(vsInstall, 'MSBuild', 'Microsoft', 'DesktopBridge', 'Microsoft.DesktopBridge.props');
  if (!exists(desktopBridgeProps)) {
    warn('Microsoft.DesktopBridge.props not found. Install Visual Studio component: Microsoft.VisualStudio.ComponentGroup.MSIX.Packaging');
  }
}

function cleanStaleOutputs() {
  [
    'windows/.vs',
    'windows/x64',
    'windows/Win32',
    'windows/Debug',
    'windows/Release',
    'node_modules/react-native-windows/build',
    'node_modules/react-native-windows/target',
    'node_modules/react-native-windows/Microsoft.ReactNative/x64',
    'node_modules/react-native-windows/Microsoft.ReactNative/Win32',
  ].forEach(safeRm);
}

patchPackageJson();
writeBuildGuards();
patchWindowsAppSdkBootstrap();
checkVisualStudioPackagingTools();
patchSolutionMappings();
patchProjectPlatformHints();
cleanStaleOutputs();
log('prep done');
