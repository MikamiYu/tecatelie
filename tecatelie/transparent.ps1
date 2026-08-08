Add-Type -AssemblyName System.Drawing
$src = "C:\Users\yumim\.gemini\antigravity\brain\2abc505b-2073-492a-8240-25a57d4f2877\media__1782522074907.png"
$dest = "C:\Users\yumim\.gemini\antigravity\scratch\tecatelie\logo-graffiti-icon.png"
$bmp = New-Object System.Drawing.Bitmap($src)
$bmp.MakeTransparent([System.Drawing.Color]::White)
$bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Transparent image saved successfully"
