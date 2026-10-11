"""Recorta, convierte a WebP (máx. 100 KB) y registra las fotos de la app.

Uso: python3 scripts/fotos.py CARPETA_CON_JPG [id ...]
Nombres de archivo esperados en la carpeta:
  {id-de-producto}.jpg   → public/fotos/productos/{id}.webp (cuadrada 600 px)
  cat-{categoría}.jpg    → public/fotos/categorias/{categoría}.webp
  ambiente-mercado.jpg   → public/fotos/ambiente/mercado.webp (portada)
  entrega.jpg            → public/fotos/ambiente/entrega.webp
Si se pasan ids, solo procesa esos. Siempre regenera src/data/photos.ts a partir
de lo que hay en public/fotos. Requiere Pillow (pip install pillow).
Recuerda agregar el crédito de cada foto nueva en src/data/photo-credits.ts.
"""
import json
import sys
from pathlib import Path
from PIL import Image, ImageOps

RAW = Path(sys.argv[1])
PROJECT = Path(__file__).resolve().parent.parent
ONLY = set(sys.argv[2:])
OUT = PROJECT / "public/fotos"
MAX_BYTES = 100 * 1024  # máximo por foto: la app se usa en el celular
CATEGORIES = {"pollo", "carnes", "pescados", "verduras", "hierbas", "frutas", "basicos"}
PRODUCTS = {
    line.split('id: "')[1].split('"')[0]
    for line in (PROJECT / "src/data/products.ts").read_text().splitlines()
    if line.strip().startswith('{ id: "')
}


def target(name):
    if name == "ambiente-mercado":
        return OUT / "ambiente/mercado.webp", ("width", 1400), 66
    if name == "entrega":
        return OUT / "ambiente/entrega.webp", ("width", 1000), 68
    if name.startswith("cat-") and name[4:] in CATEGORIES:
        return OUT / f"categorias/{name[4:]}.webp", ("width", 1000), 66
    if name in PRODUCTS:
        return OUT / f"productos/{name}.webp", ("square", 600), 74
    return None


def resize(img, mode):
    kind, size = mode
    if kind == "square":
        return ImageOps.fit(img, (size, size), Image.LANCZOS)
    if img.width <= size:
        return img
    return img.resize((size, round(img.height * size / img.width)), Image.LANCZOS)


for src in sorted(RAW.glob("*.jpg")):
    name = src.stem
    if ONLY and name not in ONLY:
        continue
    spec = target(name)
    if not spec:
        continue
    dest, mode, quality = spec
    img = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    dest.parent.mkdir(parents=True, exist_ok=True)
    # Baja la calidad (hasta 50) y luego el tamaño hasta quedar bajo MAX_BYTES.
    kind, size = mode
    while True:
        out = resize(img, (kind, size))
        q = quality
        out.save(dest, "WEBP", quality=q, method=6)
        while dest.stat().st_size > MAX_BYTES and q > 50:
            q -= 4
            out.save(dest, "WEBP", quality=q, method=6)
        if dest.stat().st_size <= MAX_BYTES:
            break
        size = int(size * 0.85)
    print(f"{name:20s} {img.width}x{img.height} -> {dest.relative_to(OUT)} {out.width}x{out.height} q{q} "
          f"{src.stat().st_size // 1024} KB -> {dest.stat().st_size // 1024} KB")

manifest = {
    "productos": sorted(p.stem for p in (OUT / "productos").glob("*.webp")),
    "categorias": sorted(p.stem for p in (OUT / "categorias").glob("*.webp")),
    "ambiente": sorted(p.stem for p in (OUT / "ambiente").glob("*.webp")),
}
(PROJECT / "src/data/photos.ts").write_text(
    "// Generado por el script de fotos: lista de fotos presentes en /public/fotos.\n"
    "// Si un producto no tiene foto, la app muestra su emoji.\n"
    f"export const PHOTOS = {json.dumps(manifest, indent=2)} as const;\n"
)
sizes = [p.stat().st_size for p in OUT.rglob("*.webp")]
total = sum(sizes)
print(f"más pesada: {max(sizes) // 1024} KB")
print(f"manifest: {', '.join(f'{k}={len(v)}' for k, v in manifest.items())} · total {total // 1024} KB")
