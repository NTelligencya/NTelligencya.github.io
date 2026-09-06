#!/usr/bin/env python3
"""Verify the parallax homepage's release-critical structure and assets."""

from __future__ import annotations

import json
import re
import struct
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXPECTED_CANVAS = (1672, 941)
SCENES = ("p3", "p4", "p5", "p8")
COURSE_ROUTES = ("/cdu-ai-staff/", "/cdu-teaching-staff/", "/roper-gulf/")


class PageAudit(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.links: list[dict[str, str]] = []
        self.images: list[dict[str, str]] = []
        self.metas: list[dict[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key.lower(): value or "" for key, value in attrs}
        if values.get("id"):
            self.ids.append(values["id"])
        if tag.lower() == "a":
            self.links.append(values)
        elif tag.lower() == "img":
            self.images.append(values)
        elif tag.lower() == "meta":
            self.metas.append(values)


def fail_if(condition: bool, message: str, failures: list[str]) -> None:
    if condition:
        failures.append(message)


def quoted_attrs(tag: str) -> dict[str, str]:
    return {
        key.lower(): value
        for key, _, value in re.findall(r"([:\w-]+)\s*=\s*(['\"])(.*?)\2", tag, re.S)
    }


def anchors(fragment: str) -> list[dict[str, str]]:
    return [quoted_attrs(tag) for tag in re.findall(r"<a\b[^>]*>", fragment, re.I | re.S)]


def png_size(path: Path) -> tuple[int, int]:
    with path.open("rb") as image_file:
        data = image_file.read(24)
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"not a PNG: {path}")
    return struct.unpack(">II", data[16:24])


def webp_size(path: Path) -> tuple[int, int]:
    with path.open("rb") as image_file:
        data = image_file.read(64)
    if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        raise ValueError(f"not a WebP: {path}")
    chunk = data[12:16]
    if chunk == b"VP8X":
        return 1 + int.from_bytes(data[24:27], "little"), 1 + int.from_bytes(data[27:30], "little")
    if chunk == b"VP8 ":
        marker = data.find(b"\x9d\x01\x2a", 20)
        if marker < 0:
            raise ValueError(f"missing VP8 frame header: {path}")
        width, height = struct.unpack("<HH", data[marker + 3 : marker + 7])
        return width & 0x3FFF, height & 0x3FFF
    if chunk == b"VP8L" and data[20] == 0x2F:
        bits = int.from_bytes(data[21:25], "little")
        return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
    raise ValueError(f"unsupported WebP chunk {chunk!r}: {path}")


def jpeg_size(path: Path) -> tuple[int, int]:
    data = path.read_bytes()
    if data[:2] != b"\xff\xd8":
        raise ValueError(f"not a JPEG: {path}")
    offset = 2
    while offset < len(data):
        if data[offset] != 0xFF:
            offset += 1
            continue
        marker = data[offset + 1]
        offset += 2
        if marker in (0xD8, 0xD9):
            continue
        length = int.from_bytes(data[offset : offset + 2], "big")
        if marker in range(0xC0, 0xC4):
            return int.from_bytes(data[offset + 5 : offset + 7], "big"), int.from_bytes(data[offset + 3 : offset + 5], "big")
        offset += length
    raise ValueError(f"missing JPEG frame header: {path}")


def image_size(path: Path) -> tuple[int, int]:
    if path.suffix.lower() == ".png":
        return png_size(path)
    if path.suffix.lower() == ".webp":
        return webp_size(path)
    if path.suffix.lower() in (".jpg", ".jpeg"):
        return jpeg_size(path)
    raise ValueError(f"unsupported image type: {path}")


def main() -> int:
    failures: list[str] = []
    pages = {
        "home": ROOT / "index.html",
        "library": ROOT / "library" / "index.html",
        "courses": ROOT / "courses" / "index.html",
        "tools": ROOT / "simulations" / "index.html",
    }
    html = {name: path.read_text(encoding="utf-8") for name, path in pages.items()}
    hub = (ROOT / "client-access" / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "homepage-parallax.css").read_text(encoding="utf-8")
    js = (ROOT / "homepage-parallax.js").read_text(encoding="utf-8")
    index_builder = (ROOT / "tools" / "build-index.js").read_text(encoding="utf-8")

    audits: dict[str, PageAudit] = {}
    for name, markup in html.items():
        audit = PageAudit()
        audit.feed(markup)
        audits[name] = audit
        duplicate_ids = sorted(value for value, count in Counter(audit.ids).items() if count > 1)
        fail_if(bool(duplicate_ids), f"duplicate IDs on {name}: {duplicate_ids}", failures)
        chapter_count = len(re.findall(r'<section class="hp-chapter hp-page-hero"', markup))
        fail_if(chapter_count != 1, f"{name} should contain exactly one landing hero, found {chapter_count}", failures)

    expected_scene = {
        "home": ("p3", ("01-clean-background-v2.jpg", "03-hero-keyboard-v2.png", "05-brand-interface.webp")),
        "library": ("p4", ("01-clean-background.webp", "02-midground-trees-fence.webp", "04-foreground-earth-circuitry.webp", "03-hero-processor.webp", "05-brand-interface.webp")),
        "courses": ("p8", ("01-clean-background.webp", "02-midground-trees-fence.webp", "04-foreground-earth-circuitry.webp", "03-hero-stone-qr.webp", "05-brand-interface.webp")),
        "tools": ("p5", ("01-clean-background.webp", "02-midground-trees-fence.webp", "04-foreground-earth-circuitry.webp", "03-hero-glass-envelope.webp", "05-brand-interface.webp")),
    }
    all_layers: list[dict[str, str]] = []
    for name, (scene, expected_files) in expected_scene.items():
        layers = [image for image in audits[name].images if "hp-layer" in image.get("class", "").split()]
        all_layers.extend(layers)
        fail_if(len(layers) != len(expected_files), f"{name} should contain {len(expected_files)} scene layers, found {len(layers)}", failures)
        active_files = tuple(Path(image.get("src", "")).name for image in layers)
        fail_if(active_files != expected_files, f"unexpected active layers on {name}: {active_files}", failures)
        for image in layers:
            source = ROOT / image.get("src", "").lstrip("/")
            fail_if(not source.is_file(), f"missing scene asset: {source}", failures)
            fail_if((image.get("width"), image.get("height")) != ("1672", "941"), f"wrong HTML dimensions: {source}", failures)
            fail_if(f"/parallax/{scene}/" not in image.get("src", ""), f"wrong scene layer on {name}: {image.get('src')}", failures)

    fail_if(len(all_layers) != 18, f"expected 18 active layers across four landing pages, found {len(all_layers)}", failures)
    fail_if(any(retired in html["home"] for retired in ("02-midground-trees-fence.webp", "03-hero-keyboard.webp", "04-foreground-earth-circuitry.webp")), "homepage still references a retired damaged P3 layer", failures)
    fail_if(any(marker in html["home"] for marker in ('id="workshops"', 'id="training-games"', 'id="courses"', 'id="about"', '/parallax/p4/', '/parallax/p5/', '/parallax/p8/')), "homepage contains content assigned to a subsection", failures)
    fail_if('id="menu"' not in html["home"] or 'id="site-search-mount"' not in html["home"], "homepage Main Menu or search is missing", failures)
    fail_if('>Main Menu<' not in html["home"], "approved Main Menu wording is missing", failures)
    for required in ('id="workshops"', 'id="training-games"', 'id="presentations"', 'id="about"'):
        fail_if(required not in html["library"], f"library page is missing {required}", failures)
    fail_if('id="courses"' not in html["courses"], "full course page is missing the course catalogue", failures)
    fail_if('class="banner"' in html["tools"] or "bannerochre" in html["tools"], "old simulation banner remains", failures)

    secret_links = [link for link in audits["home"].links if "hp-secret" in link.get("class", "").split()]
    fail_if(len(secret_links) != 2, f"expected two secret links on home, found {len(secret_links)}", failures)
    for link in secret_links:
        fail_if(link.get("href") != "/client-access/", "secret link does not point to /client-access/", failures)
        fail_if(link.get("target") != "_blank" or "noopener" not in link.get("rel", "").split(), "secret link lacks safe new-tab behaviour", failures)
        fail_if(not link.get("aria-label"), "secret link lacks an accessible name", failures)

    for region_name in ("home", "library", "courses"):
        markup = html[region_name]
        header_start = markup.find('<header class="site">')
        header_end = markup.find("</header>")
        for link in anchors(markup[header_start:header_end]):
            fail_if(link.get("target") != "_blank" or "noopener" not in link.get("rel", "").split(), f"unsafe header link on {region_name}: {link.get('href')}", failures)
    menu_start = html["home"].find('<section class="hp-destinations"')
    menu_end = html["home"].find("</main>", menu_start)
    for link in anchors(html["home"][menu_start:menu_end]):
        fail_if(link.get("target") != "_blank" or "noopener" not in link.get("rel", "").split(), f"unsafe Main Menu link: {link.get('href')}", failures)

    old_routes = ('href="/#library"', 'href="/#workshops"', 'href="/#training-games"', 'href="/#about"')
    for name, markup in html.items():
        fail_if(any(route in markup for route in old_routes), f"stale homepage anchor remains on {name}", failures)
        fail_if("Practical knowledge written into the landscape" in markup, f"unapproved slogan is present on {name}", failures)
        fail_if(markup.count("Intelligence Inked") > 0, f"repeated slogan was added as HTML text on {name}", failures)

    hub_audit = PageAudit()
    hub_audit.feed(hub)
    robots = [meta.get("content", "").replace(" ", "").lower() for meta in hub_audit.metas if meta.get("name", "").lower() == "robots"]
    fail_if("noindex,nofollow" not in robots, "client-access hub lacks noindex,nofollow", failures)
    hub_routes = tuple(link.get("href", "") for link in hub_audit.links if "access-course" in link.get("class", "").split())
    fail_if(hub_routes != COURSE_ROUTES, f"unexpected client routes: {hub_routes}", failures)
    fail_if("'/client-access/'" not in index_builder, "client hub is not excluded by the index generator", failures)

    fail_if("prefers-reduced-motion: reduce" not in css, "reduced-motion CSS is missing", failures)
    fail_if("prefers-reduced-motion: reduce" not in js, "reduced-motion JavaScript guard is missing", failures)
    fail_if("(pointer: coarse)" not in css or "(pointer: fine)" not in js, "coarse-pointer keyboard guard is missing", failures)
    fail_if("requestAnimationFrame(applyKeyboardMotion)" not in js, "keyboard interpolation loop is missing", failures)
    fail_if("pointerleave" not in js or "resetKeyboardTarget" not in js, "keyboard pointer-leave reset is missing", failures)
    fail_if("pointerX * 4" not in js or "lift * -8" not in js, "keyboard motion range is not ±4px by 0 to -8px", failures)
    fail_if('data-motion="1.15"' not in html["tools"], "P5 movement multiplier is missing", failures)
    fail_if("scene === 'tools' ? 0.18 : 0.14" not in js, "P4/P5 glow gains are missing", failures)
    fail_if(".hp-page-hero .hp-stage" not in css or "width: 100vw" not in css, "full-width landing hero rule is missing", failures)

    manifest_path = ROOT / "assets" / "homepage" / "parallax" / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    fail_if(tuple(manifest.get("canvas", [])) != EXPECTED_CANVAS, "asset manifest canvas is incorrect", failures)
    for path in (
        ROOT / "assets" / "homepage" / "parallax" / "p3" / "01-clean-background-v2.jpg",
        ROOT / "assets" / "homepage" / "parallax" / "p3" / "03-hero-keyboard-v2.png",
        ROOT / "assets" / "homepage" / "parallax" / "p3" / "05-brand-interface.webp",
    ):
        fail_if(not path.is_file(), f"missing active P3 v2 asset: {path}", failures)
        if path.is_file():
            fail_if(image_size(path) != EXPECTED_CANVAS, f"wrong active P3 v2 dimensions: {path}", failures)
    for scene in SCENES:
        source_files = sorted((ROOT / "assets" / "homepage" / "parallax" / "_source" / scene).glob("*.png"))
        delivery_files = sorted((ROOT / "assets" / "homepage" / "parallax" / scene).glob("*.webp"))
        fail_if(len(source_files) != 5 or len(delivery_files) != 5, f"{scene} does not contain five source and five delivery layers", failures)
        for path in source_files:
            fail_if(png_size(path) != EXPECTED_CANVAS, f"wrong source dimensions: {path}", failures)
        for path in delivery_files:
            fail_if(webp_size(path) != EXPECTED_CANVAS, f"wrong delivery dimensions: {path}", failures)

    secret_png = ROOT / "assets" / "homepage" / "secret-access" / "padlock-mouse-phone-hd-v1.png"
    secret_webp = secret_png.with_suffix(".webp")
    fail_if(png_size(secret_png) != EXPECTED_CANVAS or webp_size(secret_webp) != EXPECTED_CANVAS, "secret image dimensions are incorrect", failures)

    layout_report = ROOT / "review-screenshots-v3" / "layout-checks.txt"
    if layout_report.is_file():
        for line in layout_report.read_text(encoding="utf-8").splitlines():
            payload = json.loads(line[line.index("{") :])
            fail_if(payload["innerWidth"] != payload["scrollWidth"], f"horizontal overflow: {line}", failures)

    if failures:
        print("SECTION HERO QA FAILED")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("SECTION HERO QA PASS")
    print("P3 home · P4 library · P5 simulation tools · P8 full course list")
    print("4 routes · 18 active delivery layers · 2 discreet course links · 3 client destinations")
    print("P3 uses 3 registered v2 planes; retired damaged layers remain stored but unreferenced")
    print("1672 × 941 active, source and delivery files verified · no duplicate IDs · safe new-tab navigation")
    print("noindex/nofollow and index exclusion verified · reduced motion hooks present")
    if layout_report.is_file():
        print("desktop and mobile captures report no horizontal overflow")
    return 0


if __name__ == "__main__":
    sys.exit(main())
