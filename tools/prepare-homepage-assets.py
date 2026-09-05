#!/usr/bin/env python3
"""Build the delivery images for the parallax homepage from approved PNGs."""

from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "homepage" / "parallax" / "_source"
OUTPUT = ROOT / "assets" / "homepage" / "parallax"
SCENES = ("p3", "p4", "p5", "p8")
LAYERS = (
    "01-clean-background.png",
    "02-midground-trees-fence.png",
    "03-hero-keyboard.png",
    "04-foreground-earth-circuitry.png",
    "05-brand-interface.png",
)
HERO_NAMES = {
    "p3": "03-hero-keyboard.png",
    "p4": "03-hero-processor.png",
    "p5": "03-hero-glass-envelope.png",
    "p8": "03-hero-stone-qr.png",
}


def layer_names(scene: str) -> tuple[str, ...]:
    names = list(LAYERS)
    names[2] = HERO_NAMES[scene]
    return tuple(names)


def alpha_summary(image: Image.Image) -> dict[str, float | int | str]:
    result: dict[str, float | int | str] = {
        "width": image.width,
        "height": image.height,
        "mode": image.mode,
    }
    if "A" in image.getbands():
        histogram = image.getchannel("A").histogram()
        pixels = image.width * image.height
        result["transparent_percent"] = round(histogram[0] * 100 / pixels, 3)
        result["opaque_percent"] = round(histogram[255] * 100 / pixels, 3)
    return result


def save_near_lossless(source: Path, destination: Path, strength: int) -> None:
    """Preserve alpha and fine linework with WebP near-lossless encoding."""
    encoder = shutil.which("cwebp")
    if encoder:
        subprocess.run(
            [
                encoder,
                "-quiet",
                "-mt",
                "-m",
                "4",
                "-near_lossless",
                str(strength),
                "-alpha_q",
                "100",
                str(source),
                "-o",
                str(destination),
            ],
            check=True,
        )
        return
    # Pillow has no near-lossless switch. Its lossless mode is the safe fallback.
    with Image.open(source) as image:
        image.save(destination, "WEBP", lossless=True, method=6, exact=True)


def main() -> None:
    manifest: dict[str, object] = {"canvas": [1672, 941], "scenes": {}}
    for scene in SCENES:
        scene_output = OUTPUT / scene
        scene_output.mkdir(parents=True, exist_ok=True)
        scene_manifest = []
        for name in layer_names(scene):
            source = SOURCE / scene / name
            image = Image.open(source)
            if image.size != (1672, 941):
                raise ValueError(f"Unexpected canvas for {source}: {image.size}")
            destination = scene_output / f"{source.stem}.webp"
            strength = 94 if name.startswith("05-") else 90
            save_near_lossless(source, destination, strength)
            details = alpha_summary(image)
            details.update({"source": str(source.relative_to(ROOT)), "delivery": str(destination.relative_to(ROOT))})
            scene_manifest.append(details)
        manifest["scenes"][scene] = scene_manifest

    secret_source = ROOT / "assets" / "homepage" / "secret-access" / "padlock-mouse-phone-hd-v1.png"
    secret = Image.open(secret_source)
    save_near_lossless(secret_source, secret_source.with_suffix(".webp"), 94)
    manifest["secret_access"] = alpha_summary(secret)
    (OUTPUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
