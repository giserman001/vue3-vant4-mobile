# 下载并安装 Cloudflare Tunnel
$installDir = "$PSScriptRoot\..\bin"
$cloudflaredPath = "$installDir\cloudflared.exe"

# 创建目录
if (!(Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir | Out-Null
}

# 下载 cloudflared
if (!(Test-Path $cloudflaredPath)) {
    Write-Host "正在下载 cloudflared..."
    $url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
    Invoke-WebRequest -Uri $url -OutFile $cloudflaredPath
    Write-Host "下载完成!"
}

# 启动 tunnel
Write-Host "启动 Cloudflare Tunnel..."
& $cloudflaredPath tunnel --url https://localhost:9999
