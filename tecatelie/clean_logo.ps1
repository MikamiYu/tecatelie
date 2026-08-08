Add-Type -AssemblyName System.Drawing
$src = "C:\Users\yumim\.gemini\antigravity\brain\2abc505b-2073-492a-8240-25a57d4f2877\media__1782522074907.png"
$dest = "C:\Users\yumim\.gemini\antigravity\scratch\tecatelie\logo-graffiti-clean.png"

$bmp = New-Object System.Drawing.Bitmap($src)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $c = $bmp.GetPixel($x, $y)
        # If pixel is near white background
        if ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            $newBmp.SetPixel($x, $y, $c)
        }
    }
}

$newBmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "HD transparent logo created successfully"
