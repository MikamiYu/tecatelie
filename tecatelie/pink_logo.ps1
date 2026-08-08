Add-Type -AssemblyName System.Drawing
$src = "C:\Users\yumim\.gemini\antigravity\scratch\tecatelie\logo-black.png"
$dest = "C:\Users\yumim\.gemini\antigravity\scratch\tecatelie\logo-pink.png"

$bmp = New-Object System.Drawing.Bitmap($src)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

# Brand Pink color: #ff007a (R: 255, G: 0, B: 122)
for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $c = $bmp.GetPixel($x, $y)
        # If pixel has alpha opacity (black text)
        if ($c.A -gt 30) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($c.A, 255, 0, 122))
        } else {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$newBmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Pink logo created"
