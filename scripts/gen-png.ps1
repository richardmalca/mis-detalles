Add-Type -AssemblyName System.Drawing
$width = 1200
$height = 630
$bitmap = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

$rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$brushBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(12, 9, 3))
$graphics.FillRectangle($brushBg, $rect)

$penGold = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(251, 191, 36), 3)
$graphics.DrawRectangle($penGold, 40, 40, 1120, 550)

$fontBadge = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Bold)
$fontTitle = New-Object System.Drawing.Font("Arial", 46, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Arial", 26, [System.Drawing.FontStyle]::Regular)
$fontButton = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Bold)

$brushYellow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(253, 224, 71))
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$brushDark = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(12, 9, 3))

$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center

$graphics.DrawString("FLORES AMARILLAS  21 DE MARZO", $fontBadge, $brushYellow, 600, 110, $sf)
$graphics.DrawString("Tengo un detalle especial para ti", $fontTitle, $brushWhite, 600, 190, $sf)
$graphics.DrawString("Abre este enlace para descubrir el universo que prepare para ti", $fontSub, $brushYellow, 600, 290, $sf)

$btnRect = New-Object System.Drawing.Rectangle(360, 400, 480, 80)
$graphics.FillRectangle($brushYellow, $btnRect)
$graphics.DrawString("TOCA PARA ABRIR", $fontButton, $brushDark, 600, 425, $sf)

$bitmap.Save("d:\Proyectos Personales\mis-detalles\public\og-image.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()
Write-Output "PNG_READY"
