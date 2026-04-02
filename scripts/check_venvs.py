"""
Check that each requirements.txt is in sync with its corresponding .venv.

Checks:
  - <repo_root>/requirements.txt  vs  <repo_root>/.venv
  - <repo_root>/backend/requirements.txt  vs  <repo_root>/backend/.venv

Exits with code 1 if any discrepancies are found.
"""

import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent

PAIRS = [
    (REPO_ROOT / "requirements.txt", REPO_ROOT / ".venv"),
    (REPO_ROOT / "backend" / "requirements.txt", REPO_ROOT / "backend" / ".venv"),
]


def pip_exe(venv: Path) -> Path:
    # On Windows the binary lives under Scripts/, on Unix under bin/
    for candidate in [venv / "bin" / "pip", venv / "Scripts" / "pip.exe"]:
        if candidate.exists():
            return candidate
    raise FileNotFoundError(f"pip not found in {venv}")


def installed_packages(venv: Path) -> dict[str, str]:
    """Return {normalised_name: version} for every package installed in the venv."""
    pip = pip_exe(venv)
    result = subprocess.run(
        [str(pip), "freeze", "--all"],
        capture_output=True,
        text=True,
        check=True,
    )
    packages = {}
    for line in result.stdout.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or line.startswith("-"):
            continue
        if "==" in line:
            name, version = line.split("==", 1)
            packages[normalise(name)] = version
    return packages


def required_packages(requirements: Path) -> dict[str, str]:
    """Return {normalised_name: version} from a requirements.txt."""
    packages = {}
    for line in requirements.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or line.startswith("-"):
            continue
        if "==" in line:
            name, version = line.split("==", 1)
            packages[normalise(name)] = version
    return packages


def normalise(name: str) -> str:
    """Normalise a package name to lowercase with hyphens (PEP 503)."""
    return name.lower().replace("_", "-").replace(".", "-")


def check(requirements: Path, venv: Path) -> list[str]:
    errors = []

    if not requirements.exists():
        errors.append(f"  requirements.txt not found: {requirements}")
        return errors

    if not venv.exists():
        errors.append(f"  .venv not found: {venv}")
        return errors

    required = required_packages(requirements)
    try:
        installed = installed_packages(venv)
    except (FileNotFoundError, subprocess.CalledProcessError) as exc:
        errors.append(f"  unable to inspect venv: {venv} ({exc})")
        return errors

    missing = {k: v for k, v in required.items() if k not in installed}
    wrong_version = {
        k: (required[k], installed[k])
        for k in required
        if k in installed and required[k] != installed[k]
    }
    # pip and setuptools are always present in a venv — not application dependencies
    VENV_BUILTINS = {"pip", "setuptools", "wheel"}
    extra = {
        k: v
        for k, v in installed.items()
        if k not in required and k not in VENV_BUILTINS
    }

    for name, version in missing.items():
        errors.append(
            f"  MISSING   {name}=={version} (in requirements.txt, not in venv)"
        )

    for name, (req_ver, inst_ver) in wrong_version.items():
        errors.append(
            f"  MISMATCH  {name}: requirements.txt={req_ver}, venv={inst_ver}"
        )

    for name, version in extra.items():
        errors.append(
            f"  EXTRA     {name}=={version} (in venv, not in requirements.txt)"
        )

    return errors


def main() -> None:
    any_errors = False

    for requirements, venv in PAIRS:
        label = requirements.relative_to(REPO_ROOT)
        print(f"\nChecking {label} against {venv.relative_to(REPO_ROOT)} ...")
        errors = check(requirements, venv)

        if errors:
            any_errors = True
            print(f"  FAIL — {len(errors)} issue(s) found:")
            for e in errors:
                print(e)
        else:
            print("  OK")

    print()
    if any_errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
