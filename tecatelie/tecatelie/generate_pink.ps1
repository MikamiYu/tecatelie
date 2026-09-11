Add-Type -AssemblyName System.Drawing
$src = "C:\Users\yumim\.gemini\antigravity\scratch\tecatelie\logo-black.png"
$dest = "C:\Users\yumim\.gemini\antigravity\scratch\tecatelie\logo-pink.png"

$bmp = New-Object System.Drawing.Bitmap($src)
for ($y=0; $y -lt $bmp.Height; $y++) {
    for ($x=0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.A -gt 0) {
            # Paint pink (#ff007a)
            $newC = [System.Drawing.Color]::FromArgb($c.A, 255, 0, 122)
            $bmp.SetPixel($x, $y, $newC)
        }
    }
}
$bmp.Save($dest)
$bmp.Dispose()
