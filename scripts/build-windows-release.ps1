$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$sln = Get-ChildItem ".\windows" -Recurse -Filter "*.sln" |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1

if (-not $sln) {
  throw "Không tìm thấy file .sln trong thư mục windows. Hãy chạy: npm run windows:init"
}

$msbuild = "${env:ProgramFiles}\Microsoft Visual Studio\2022\Community\MSBuild\Current\Bin\MSBuild.exe"

if (-not (Test-Path $msbuild)) {
  $msbuild = "${env:ProgramFiles}\Microsoft Visual Studio\2022\BuildTools\MSBuild\Current\Bin\MSBuild.exe"
}

if (-not (Test-Path $msbuild)) {
  throw "Không tìm thấy MSBuild.exe. Cài Visual Studio 2022 Community hoặc Build Tools với workload UWP/C++."
}

Write-Host "Solution: $($sln.FullName)"
Write-Host "MSBuild:  $msbuild"

& $msbuild $sln.FullName `
  /restore `
  /p:Configuration=Release `
  /p:Platform=x64 `
  /p:PlatformToolset=v143 `
  /p:PreferredToolArchitecture=x64 `
  /p:AppxBundle=Never `
  /p:UapAppxPackageBuildMode=SideloadOnly `
  /p:GenerateAppxPackageOnBuild=true `
  /m:1 `
  /nr:false `
  /v:m

Write-Host ""
Write-Host "Build xong. File mới nhất:"
Get-ChildItem ".\windows" -Recurse -File -Include *.exe,*.msix,*.appx,*.msixbundle,*.appxbundle |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 20 FullName, LastWriteTime