$ErrorActionPreference = 'Stop'
$app = 'C:\Users\tonim\AppData\Local\PlegarPro\app-0.24.3'
$server = Join-Path $app 'servidor-plegar-pro.mjs'
$ports = 4186..4205
try {
  if (-not (Test-Path (Join-Path $app 'dist\index.html'))) { throw 'No existe la compilaciÃ³n de Plegar Pro. Reinstale la aplicaciÃ³n.' }
  $node = (Get-Command node.exe -ErrorAction Stop).Source
  $port = $null
  foreach ($candidate in $ports) {
    $used = Get-NetTCPConnection -LocalPort $candidate -State Listen -ErrorAction SilentlyContinue
    if (-not $used) { $port = $candidate; break }
  }
  if (-not $port) { throw 'No hay ningÃºn puerto libre entre 4186 y 4205.' }
  Start-Process -FilePath $node -ArgumentList @($server,$port) -WorkingDirectory $app -WindowStyle Hidden
  $ready = $false
  for ($i = 0; $i -lt 50; $i++) {
    try {
      Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$port" -TimeoutSec 1 | Out-Null
      $ready = $true
      break
    } catch {
      Start-Sleep -Milliseconds 200
    }
  }
  if (-not $ready) { throw 'El servidor local no respondiÃ³ a tiempo.' }
  Start-Process "http://127.0.0.1:$port"
} catch {
  Add-Type -AssemblyName PresentationFramework
  [System.Windows.MessageBox]::Show($_.Exception.Message,'Plegar Pro') | Out-Null
  exit 3
}
