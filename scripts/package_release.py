#!/usr/bin/env python3
"""Build deterministic public assets from an explicit allowlist; never upload anything."""

import hashlib
import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parent.parent
VERSION = json.loads((ROOT / "package.json").read_text())["version"]
OUTPUT = ROOT / "release"
FILES = [
    "cozi-calendar-card.js", "hacs.json", "package.json", "LICENSE", "README.md",
    "CHANGELOG.md", "CONTRIBUTING.md", "SECURITY.md", "VALIDATION.md",
    "example.yaml", "dashboard.yaml", "demo.html", ".gitignore", "RELEASE_TASKS.md",
]
TREES = [".github", "scripts", "test", "docs", "assets"]


def public_files():
    paths = [ROOT / name for name in FILES]
    for directory in TREES:
        parent = ROOT / directory
        if parent.exists():
            paths.extend(path for path in parent.rglob("*") if path.is_file())
    for path in sorted(paths):
        if path.is_symlink():
            raise ValueError(f"Symlinks cannot be packaged: {path.relative_to(ROOT)}")
        if not path.is_file():
            raise FileNotFoundError(path.relative_to(ROOT))
        if path.suffix not in {".zip", ".pyc"} and "__pycache__" not in path.parts:
            yield path


OUTPUT.mkdir(exist_ok=True)
archive = OUTPUT / f"cozi-calendar-card-{VERSION}.zip"
paths = list(public_files())
with ZipFile(archive, "w", compression=ZIP_DEFLATED, compresslevel=9) as zipped:
    for path in paths:
        info = ZipInfo(path.relative_to(ROOT).as_posix(), date_time=(1980, 1, 1, 0, 0, 0))
        info.create_system = 3
        info.external_attr = 0o100644 << 16
        info.compress_type = ZIP_DEFLATED
        zipped.writestr(info, path.read_bytes(), compresslevel=9)
with ZipFile(archive) as zipped:
    assert zipped.testzip() is None
(OUTPUT / "cozi-calendar-card.js").write_bytes((ROOT / "cozi-calendar-card.js").read_bytes())
assets = [OUTPUT / "cozi-calendar-card.js", archive]
checksums = "".join(f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}\n" for path in assets)
(OUTPUT / "SHA256SUMS").write_text(checksums)
print(f"Packaged {len(paths)} public files in release/{archive.name}; JavaScript and SHA256SUMS ready.")
