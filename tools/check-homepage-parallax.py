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
    data = path.read_bytes()[:24]
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"not a PNG: {path}")
    return struct.unpack(">II", data[16:24])


def webp_size(path: Path) -> tuple[int, int]:
    data = path.read_bytes()[:64]
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


def main() -> int:
    failures: list[str] = []
    homepage = (ROOT / "index.html").read_text(encoding="utf-8")
    hub = (ROOT / "client-access" / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "homepage-parallax.css").read_text(encoding="utf-8")
    js = (ROOT / "homepage-parallax.js").read_text(encoding="utf-8")
    index_builder = (ROOT / "tools" / "build-index.js").read_text(encoding="utf-8")

    homepage_audit = PageAudit()
    homepage_audit.feed(homepage)
    duplicate_ids = sorted(value for value, count in Counter(homepage_audit.ids).items() if count > 1)
    fail_if(bool(duplicate_ids), f"duplicate homepage IDs: {duplicate_ids}", failures)

    chapter_ids = re.findall(r'<section class="hp-chapter" id="([^"]+)"', homepage)
    fail_if(
        chapter_ids != ["parallax-home", "parallax-library", "parallax-tools", "parallax-presentations"],
        f"unexpected chapter sequence: {chapter_ids}",
        failures,
    )

    layers = [image for image in homepage_audit.images if "hp-layer" in image.get("class", "").split()]
    fail_if(len(layers) != 20, f"expected 20 scene layers, found {len(layers)}", failures)
    for image in layers:
        source = ROOT / image.get("src", "").lstrip("/")
        fail_if(not source.is_file(), f"missing scene asset: {source}", failures)
        fail_if((image.get("width"), image.get("height")) != ("1672", "941"), f"wrong HTML dimensions: {source}", failures)
    lazy_layers = [image for image in layers if image.get("loading") == "lazy" and image.get("decoding") == "async"]
    fail_if(len(lazy_layers) != 15, f"expected 15 deferred layers, found {len(lazy_layers)}", failures)

    secret_links = [link for link in homepage_audit.links if "hp-secret" in link.get("class", "").split()]
    fail_if(len(secret_links) != 2, f"expected two secret links, found {len(secret_links)}", failures)
    for link in secret_links:
        fail_if(link.get("href") != "/client-access/", "secret link does not point to /client-access/", failures)
        fail_if(link.get("target") != "_blank" or "noopener" not in link.get("rel", "").split(), "secret link lacks safe new-tab behaviour", failures)
        fail_if(not link.get("aria-label"), "secret link lacks an accessible name", failures)

    header_start = homepage.find('<header class="site">')
    header_end = homepage.find("</header>")
    menu_start = homepage.find('<section class="hp-destinations"')
    menu_end = homepage.find('<section class="hp-chapter" id="parallax-library"')
    required_regions = [homepage[header_start:header_end], homepage[menu_start:menu_end]]
    required_regions.extend(re.findall(r'<nav class="hp-scene-links".*?</nav>', homepage, re.I | re.S))
    for link in [link for region in required_regions for link in anchors(region)]:
        fail_if(link.get("target") != "_blank" or "noopener" not in link.get("rel", "").split(), f"unsafe destination link: {link.get('href')}", failures)

    fail_if("Practical knowledge written into the landscape" in homepage, "unapproved homepage slogan is present", failures)
    fail_if(homepage.count("Intelligence Inked") > 0, "repeated slogan was added as HTML text", failures)

    hub_audit = PageAudit()
    hub_audit.feed(hub)
    robots = [meta.get("content", "").replace(" ", "").lower() for meta in hub_audit.metas if meta.get("name", "").lower() == "robots"]
    fail_if("noindex,nofollow" not in robots, "client-access hub lacks noindex,nofollow", failures)
    hub_routes = tuple(link.get("href", "") for link in hub_audit.links if "access-course" in link.get("class", "").split())
    fail_if(hub_routes != COURSE_ROUTES, f"unexpected client routes: {hub_routes}", failures)
    for link in hub_audit.links:
        fail_if(link.get("target") != "_blank" or "noopener" not in link.get("rel", "").split(), f"unsafe hub link: {link.get('href')}", failures)
    for route in COURSE_ROUTES:
        fail_if(not (ROOT / route.lstrip("/") / "index.html").is_file(), f"missing course destination: {route}", failures)
    fail_if("'/client-access/'" not in index_builder, "client hub is not excluded by the index generator", failures)

    fail_if("prefers-reduced-motion: reduce" not in css, "reduced-motion CSS is missing", failures)
    fail_if("prefers-reduced-motion: reduce" not in js, "reduced-motion JavaScript guard is missing", failures)
    fail_if("data-motion=\"1.15\"" not in homepage, "P5 movement multiplier is missing", failures)
    fail_if("scene === 'tools' ? 0.18 : 0.14" not in js, "P4/P5 glow gains are missing", failures)

    manifest_path = ROOT / "assets" / "homepage" / "parallax" / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    fail_if(tuple(manifest.get("canvas", [])) != EXPECTED_CANVAS, "asset manifest canvas is incorrect", failures)
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

    layout_report = ROOT / "review-screenshots" / "layout-checks.txt"
    if layout_report.is_file():
        for line in layout_report.read_text(encoding="utf-8").splitlines():
            payload = json.loads(line[line.index("{") :])
            fail_if(payload["innerWidth"] != payload["scrollWidth"], f"horizontal overflow: {line}", failures)

    if failures:
        print("PARALLAX HOMEPAGE QA FAILED")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("PARALLAX HOMEPAGE QA PASS")
    print("4 scenes · 20 delivery layers · 2 discreet course links · 3 client destinations")
    print("1672 × 941 sources and WebPs verified · no duplicate IDs · safe new-tab links")
    print("noindex/nofollow and index exclusion verified · reduced motion hooks present")
    if layout_report.is_file():
        print("1920, 1280, 430 and 390 px captures report no horizontal overflow")
    return 0


if __name__ == "__main__":
    sys.exit(main())
