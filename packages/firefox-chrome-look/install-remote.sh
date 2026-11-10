#!/usr/bin/env bash
# Download both installation files before touching a Firefox profile.
# Keep this wrapper's payload pinned so one installation cannot mix revisions.
set -euo pipefail

main() (
  local revision='9499763bcde404581bb9a0cedd801973e906ea41'
  local base="https://raw.githubusercontent.com/cjean-fr/atelier/$revision/packages/firefox-chrome-look"
  local work
  command -v curl >/dev/null || { echo 'ERROR: curl is required.' >&2; return 1; }
  work="$(mktemp -d)"
  trap 'rm -rf "$work"' EXIT

  curl --fail --silent --show-error --location --connect-timeout 10 --max-time 60 \
    "$base/install.sh" --output "$work/install.sh"
  curl --fail --silent --show-error --location --connect-timeout 10 --max-time 60 \
    "$base/userChrome.css" --output "$work/userChrome.css"
  [[ -s "$work/install.sh" && -s "$work/userChrome.css" ]] || {
    echo 'ERROR: an installation file is empty; nothing was installed.' >&2
    return 1
  }
  bash -n "$work/install.sh"

  if [[ $# -gt 0 ]]; then
    bash "$work/install.sh" "$1" "$work/userChrome.css"
  elif ( : </dev/tty ) 2>/dev/null; then
    # stdin contains this script when used as curl ... | bash. Read answers
    # from the controlling terminal, not from the pipe containing the code.
    bash "$work/install.sh" "" "$work/userChrome.css" </dev/tty
  else
    echo 'ERROR: no terminal. Pass the Firefox profile directory: bash -s -- /path/to/profile' >&2
    return 1
  fi
)

# A truncated download must parse the complete function before doing any work.
main "$@"
