# crea

Convierte una carpeta de fotos y una canción en un vídeo **MP4 1920×1080**, con fundidos
suaves, un zoom lento y fondo desenfocado en las fotos verticales. Gratis, sin registro y
sin enviar tus archivos a ningún servidor.

- **Página web:** https://josepin2.github.io/crea/
- **Descargar la última versión:** https://github.com/josepin2/crea/releases/latest
- **Requisitos:** Windows 10 / 11 de 64 bits

## Cómo se usa

1. Ejecuta **`Instalar-crea.exe`**. Se instala solo; la primera vez descarga su motor de
   vídeo (unos 110 MB) y muestra el progreso.
2. Abre la carpeta donde tengas las fotos y la música.
3. Haz clic en la **barra de direcciones** del Explorador (donde aparece la ruta), escribe
   `crea` y pulsa ENTER.

El vídeo aparece en esa misma carpeta con el nombre de la carpeta.

## Qué hace

- Entre **8 y 100 fotos** (JPG, PNG, WebP, BMP, TIF) y al menos una pista de música
  (MP3, M4A, WAV, OGG, FLAC).
- **Máximo 7 segundos por foto**, con un **fundido cruzado** de 0,7 s y un **zoom lento**
  que alterna acercar y alejar.
- Si la música es más larga que las fotos, la secuencia **se repite en bucle**.
- Las fotos verticales se ven enteras sobre un **fondo desenfocado**, sin franjas negras.
- La música entra y se apaga suavemente; varias pistas se encadenan.
- Comprueba los archivos antes de montar nada y **salta los que estén dañados**.
- Salida: **1920×1080, 30 fps, H.264 + AAC**, con arranque rápido.

## Estructura del repositorio

Este repositorio contiene la **página web** (`index.html`, `styles.css`, `script.js`), que
es estática y no usa dependencias externas.

El programa se publica como **archivo adjunto en la sección Releases** (no en el historial
de git) para no meter binarios de 9 MB en cada cambio.

## Créditos

Programa y página creados por **José M.C**. Programa gratuito de libre distribución, 2027.
