#!/usr/bin/env python3
from __future__ import annotations

import argparse
import shutil
from pathlib import Path

ROOT_FILES = ("index.html", "styles.css", "app.js", "detail.html", "detail.js", ".nojekyll")
GENERATED_DIRS = ("api", "entity", "technique", "adversary", "exports", "assets", "graph", "planner", "intelligence")

def replace_dir(source: Path, target: Path) -> None:
    if target.exists():
        shutil.rmtree(target)
    if source.exists():
        shutil.copytree(source, target)

def main() -> None:
    parser = argparse.ArgumentParser(description="Sync the generated portal into the legacy Pages branch-root source.")
    parser.add_argument("--source", required=True)
    parser.add_argument("--target", default=".")
    args = parser.parse_args()

    source = Path(args.source).resolve()
    target = Path(args.target).resolve()
    if not (source / "index.html").exists():
        raise SystemExit(f"Generated site missing index.html: {source}")

    for name in ROOT_FILES:
        src = source / name
        if src.exists():
            shutil.copy2(src, target / name)

    for name in GENERATED_DIRS:
        replace_dir(source / name, target / name)

    source_data = source / "data"
    target_data = target / "data"
    target_data.mkdir(parents=True, exist_ok=True)
    generated_names = set()
    if source_data.exists():
        for src in source_data.glob("*.json"):
            generated_names.add(src.name)
            shutil.copy2(src, target_data / src.name)

    # Remove stale generated top-level JSON while keeping canonical release manifests under data/releases.
    keep = generated_names
    for existing in target_data.glob("*.json"):
        if existing.name not in keep:
            existing.unlink()

    print(
        f"Synced portal root: {len(ROOT_FILES)} root files, "
        f"{len(GENERATED_DIRS)} generated directories, {len(generated_names)} data JSON files"
    )

if __name__ == "__main__":
    main()
