#!/usr/bin/env python3
"""
convert_images_to_webp.py
=========================
Genera dos variantes WebP de cada PNG en assets/img/:

  mural1.webp       <- miniatura 800px  (para el grid del index)
  mural1-full.webp  <- resolucion alta 1600px (para bg-image en paginas de detalle)

Requiere: pip install Pillow

Uso:
  python convert_images_to_webp.py

Los archivos PNG originales se mantienen intactos (fallback para navegadores viejos).
"""

import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("ERROR: Pillow no esta instalado.")
    print("Instalalo con: pip install Pillow")
    sys.exit(1)

# Directorio de imagenes
IMG_DIR = Path(__file__).parent / "assets" / "img"

# Calidad WebP (0-100). 82 es un buen balance entre calidad y tamano.
WEBP_QUALITY = 82

# Ancho maximo para miniaturas del grid (index)
THUMBNAIL_MAX_WIDTH = 800   # suficiente para Retina en cards de 220px de alto

# Ancho maximo para imagenes de detalle (bg-image a pantalla completa)
FULL_MAX_WIDTH = 1600       # suficiente para pantallas 2K en 50% del viewport


def open_rgb(png_path: Path) -> Image.Image:
    """Abre la imagen y normaliza el modo de color."""
    img = Image.open(png_path)
    if img.mode not in ('RGB', 'RGBA'):
        img = img.convert('RGB')
    return img


def resize_if_wider(img: Image.Image, max_width: int) -> Image.Image:
    """Redimensiona la imagen si supera max_width, manteniendo proporcion."""
    w, h = img.size
    if w > max_width:
        ratio = max_width / w
        new_h = int(h * ratio)
        img = img.resize((max_width, new_h), Image.LANCZOS)
        print(f"    resize: {w}x{h} -> {max_width}x{new_h}")
    return img


def save_webp(img: Image.Image, out_path: Path, quality: int) -> float:
    """Guarda la imagen como WebP y retorna el tamano en MB."""
    img.save(out_path, 'WebP', quality=quality, method=6)
    return out_path.stat().st_size / 1024 / 1024


def convert_variant(png_path: Path, suffix: str, max_width: int, force: bool = False) -> float:
    """
    Convierte PNG a WebP con el sufijo y tamano indicados.
    Retorna el tamano del WebP en MB (0 si se salto).
    """
    stem = png_path.stem                          # e.g. "mural4"
    webp_name = f"{stem}{suffix}.webp"            # e.g. "mural4-full.webp"
    webp_path = png_path.parent / webp_name

    if webp_path.exists() and not force:
        print(f"    -- Ya existe, saltando: {webp_name}")
        return webp_path.stat().st_size / 1024 / 1024

    original_mb = png_path.stat().st_size / 1024 / 1024

    with open_rgb(png_path) as img:
        img = resize_if_wider(img, max_width)
        webp_mb = save_webp(img, webp_path, WEBP_QUALITY)

    savings = (1 - webp_mb / original_mb) * 100
    print(f"    OK {webp_name}: {original_mb:.1f} MB -> {webp_mb:.3f} MB  (ahorro: {savings:.0f}%)")
    return webp_mb


def main():
    if not IMG_DIR.exists():
        print(f"ERROR: No se encontro el directorio {IMG_DIR}")
        sys.exit(1)

    png_files = sorted(IMG_DIR.glob("*.png"))

    if not png_files:
        print("No se encontraron archivos PNG en assets/img/")
        sys.exit(0)

    print(f"Generando 2 variantes WebP para {len(png_files)} imagenes...\n")
    print(f"  - Thumbnail (grid):   max {THUMBNAIL_MAX_WIDTH}px  -> <nombre>.webp")
    print(f"  - Full (detalle):     max {FULL_MAX_WIDTH}px  -> <nombre>-full.webp\n")

    total_thumb_mb = 0.0
    total_full_mb = 0.0
    total_orig_mb = 0.0

    for png in png_files:
        orig_mb = png.stat().st_size / 1024 / 1024
        print(f"[IMG] {png.name} ({orig_mb:.1f} MB)")

        # Variante 1: thumbnail 800px (para el grid del index)
        thumb_mb = convert_variant(png, suffix='', max_width=THUMBNAIL_MAX_WIDTH)

        # Variante 2: full 1600px (para bg-image en paginas de detalle)
        full_mb = convert_variant(png, suffix='-full', max_width=FULL_MAX_WIDTH)

        total_orig_mb += orig_mb
        total_thumb_mb += thumb_mb
        total_full_mb += full_mb
        print()

    total_webp_mb = total_thumb_mb + total_full_mb
    print("=" * 55)
    print(f"  PNG originales:   {total_orig_mb:.1f} MB")
    print(f"  WebP thumbnails:  {total_thumb_mb:.3f} MB")
    print(f"  WebP full:        {total_full_mb:.3f} MB")
    print(f"  TOTAL WebP:       {total_webp_mb:.3f} MB  vs {total_orig_mb:.1f} MB PNG")
    print("=" * 55)
    print("\nConversion completada.")
    print("Uso en HTML:")
    print("  Grid (index):")
    print("    <source srcset=\"mural1.webp\" type=\"image/webp\">")
    print("  Detalle (mural page):")
    print("    <source srcset=\"mural1-full.webp\" type=\"image/webp\">")


if __name__ == '__main__':
    main()
