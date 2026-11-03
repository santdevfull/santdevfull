#!/usr/bin/env python3
"""Verify the public santdev GitHub profile and its self-contained vector assets."""
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
pt = (ROOT / "README.md").read_text(encoding="utf-8")
en = (ROOT / "docs/PROFILE_EN.md").read_text(encoding="utf-8")

expected = [
    "HabitFlow", "FocusForge", "ChromaCheck", "NoteVault", "TypeMeter",
    "BudgetLab", "SprintBoard", "StudyLoop", "InvoiceKit", "DataLens",
    "PulseOps", "FlagPilot", "QueueCraft", "LedgerForge", "EventShield"
]
for language, content in (("PT", pt), ("EN", en)):
    for name in expected:
        assert re.search(r"\[" + name + r"\]\(", content), (language, name)
    assert "santdev.contato@gmail.com" in content, language
    assert "eSIM" in content and "NivIA" in content, language
    assert "QA" in content, language
    assert "2026" in content, language
    assert "assets/profile-hero.svg" in content, language
    assert "assets/nivia-systems.svg" in content, language
    assert "santdevfull.github.io/santdevfull/" in content, language
    assert "github-readme-stats" not in content and "shields.io" not in content
    assert "cauesantiagosilva@gmail.com" not in content, language
    for link in re.findall(r"\]\(([^)]+)\)", content):
        if link.startswith(("https://", "mailto:")):
            continue
        base = ROOT if language == "PT" else ROOT / "docs"
        target = (base / link.split("#", 1)[0]).resolve()
        assert target.is_relative_to(ROOT) and target.exists(), (language, link)

for filename in ("assets/profile-hero.svg", "assets/nivia-systems.svg", "assets/avatar-santdev.svg"):
    source = (ROOT / filename).read_text(encoding="utf-8")
    tree = ET.fromstring(source)
    assert tree.tag == "{http://www.w3.org/2000/svg}svg"
    assert tree.attrib.get("viewBox"), filename
    assert len(source) < 15000
    for banned in ("<script", "<foreignObject", "<image", "http://fonts.", "data:image/", "onload="):
        assert banned not in source, (filename, banned)
    assert "santdev" in source.lower() if "profile-hero" in filename or "avatar-santdev" in filename else "NivIA" in source

print("OK: 15 linked projects per language, SVGs, Markdown links, QA claims and contact.")

avatar = (ROOT / 'assets/avatar-santdev.png').read_bytes()
assert avatar[:8] == bytes([137,80,78,71,13,10,26,10])
assert tuple(__import__('struct').unpack('>II', avatar[16:24])) == (800, 800)
print('OK: branded PNG avatar 800x800.')
