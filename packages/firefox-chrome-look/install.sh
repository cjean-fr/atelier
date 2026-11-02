#!/usr/bin/env bash
# Installs userChrome.css (Chrome-like layout for native vertical tabs) into a
# Firefox profile on Ubuntu.
#
# Usage:
#   bash install.sh <profile-dir> [path-to-userChrome.css]
#   bash install.sh            # interactive pick among detected profiles
#
# Without an argument, the script lists the profiles of every detected Firefox
# (deb, snap, flatpak) and asks for a number (Enter = default profile) or a
# pasted path. The profile directory is shown in Firefox: about:support, line
# "Profile Directory".
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
profile="${1:-}"
css_src="${2:-$script_dir/userChrome.css}"

die() { echo "ERROR: $*" >&2; exit 1; }

# --- 1. Target profile -----------------------------------------------------
if [[ -z "$profile" ]]; then
  profiles=(); names=(); default_idx=-1
  for base in \
    "$HOME/snap/firefox/common/.mozilla/firefox" \
    "$HOME/.mozilla/firefox" \
    "$HOME/.var/app/org.mozilla.firefox/.mozilla/firefox"; do
    ini="$base/profiles.ini"
    [[ -f "$ini" ]] || continue
    # default profile: the [Install*] section first
    def="$(awk -F= '/^\[/{i=($0~/^\[Install/)} i&&/^Default=/{print $2;exit}' "$ini")"
    [[ -z "$def" || "$def" = /* ]] || def="$base/$def"
    # every declared profile ([ProfileN] sections)
    while IFS=$'\t' read -r name path isdef; do
      [[ "$path" = /* ]] || path="$base/$path"
      [[ -d "$path" ]] || continue
      profiles+=("$path"); names+=("$name")
      if [[ -n "$def" && "$path" == "$def" ]]; then
        default_idx=$((${#profiles[@]} - 1))
      elif [[ -z "$def" && "$isdef" = 1 && $default_idx -lt 0 ]]; then
        default_idx=$((${#profiles[@]} - 1))
      fi
    done < <(awk -F= '
      /^\[/ { if (inprof && path != "") print name "\t" path "\t" dflt
              inprof = ($0 ~ /^\[Profile/); name = ""; path = ""; dflt = 0; next }
      inprof && /^Name=/     { name = $2 }
      inprof && /^Path=/     { path = $2 }
      inprof && /^Default=1/ { dflt = 1 }
      END     { if (inprof && path != "") print name "\t" path "\t" dflt }
    ' "$ini")
  done

  if ((${#profiles[@]} > 0)); then
    echo "Detected Firefox profiles:"
    for i in "${!profiles[@]}"; do
      mark=""; [[ $i -eq $default_idx ]] && mark=" (default)"
      printf '  %d) %s%s\n     %s\n' "$((i + 1))" "${names[$i]:-profile}" "$mark" "${profiles[$i]}"
    done
    printf "Profile number (Enter = %s, or paste a path): " \
      "$(( default_idx >= 0 ? default_idx + 1 : 1 ))"
    read -r answer || { echo "Cancelled (no input). Pass the directory as an argument: bash install.sh <profile-dir>"; exit 1; }
    if [[ -z "$answer" ]]; then
      (( default_idx < 0 )) && default_idx=0
      profile="${profiles[$default_idx]}"
    elif [[ "$answer" =~ ^[0-9]+$ ]] && (( answer >= 1 && answer <= ${#profiles[@]} )); then
      profile="${profiles[$((answer - 1))]}"
    elif [[ "$answer" =~ ^[0-9]+$ ]]; then
      die "invalid number: $answer (1..${#profiles[@]})"
    else
      profile="${answer/#\~/$HOME}"
    fi
  else
    echo "No Firefox profile detected (profiles.ini not found; Firefox never started?)."
    printf "Paste the 'Profile Directory' shown in about:support (empty to cancel): "
    read -r profile || profile=""
    [[ -n "$profile" ]] || { echo "Cancelled."; exit 1; }
    profile="${profile/#\~/$HOME}"
  fi
fi
[[ -d "$profile" ]] || die "profile directory missing: $profile"
[[ -f "$profile/prefs.js" || -f "$profile/user.js" || -f "$profile/addonStartup.json.lz4" || -d "$profile/extensions" ]] \
  || echo "WARNING: $profile does not look like a Firefox profile, continuing anyway."
echo "Target profile: $profile"

# --- 2. Source CSS file ----------------------------------------------------
[[ -f "$css_src" ]] || die "CSS file not found: $css_src (pass its path as 2nd argument, e.g. bash install.sh <profile> ~/Downloads/userChrome-*.css)"
echo "Source CSS: $css_src"

# --- 3. Enable userChrome.css loading (user.js, with backup) ---------------
pref_name='toolkit.legacyUserProfileCustomizations.stylesheets'
pref_line='user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);'
userjs="$profile/user.js"
if [[ -f "$userjs" ]]; then
  cp "$userjs" "$userjs.bak.$(date +%Y%m%d-%H%M%S)"
  # drop any existing line (enabled, disabled or commented), then write true
  grep -vF "$pref_name" "$userjs" > "$userjs.tmp" || true
  mv "$userjs.tmp" "$userjs"
fi
echo "$pref_line" >> "$userjs"

# --- 4. Copy the theme (back up an existing one first) ---------------------
mkdir -p "$profile/chrome"
dest="$profile/chrome/userChrome.css"
if [[ -f "$dest" ]]; then
  cp "$dest" "$dest.bak.$(date +%Y%m%d-%H%M%S)"
  echo "Previous userChrome.css backed up ($dest.bak.*)"
fi
cp "$css_src" "$dest"
echo "Theme installed: $dest"
echo
echo "Fully restart Firefox to apply (all windows)."
