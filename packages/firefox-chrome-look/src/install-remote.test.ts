import { afterEach, beforeEach, expect, test } from "bun:test";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = fileURLToPath(new URL("../", import.meta.url));
let work: string;
let profile: string;
let env: Record<string, string | undefined>;

beforeEach(() => {
  work = mkdtempSync(join(tmpdir(), "fxc-remote-"));
  profile = join(work, "profile with spaces");
  mkdirSync(profile);
  writeFileSync(join(profile, "prefs.js"), "");
  mkdirSync(join(work, "bin"));
  mkdirSync(join(work, "downloads"));
  // Mock only the network boundary; execute the real downloaded installer.
  const curl = join(work, "bin/curl");
  writeFileSync(
    curl,
    `#!/usr/bin/env bash
set -eu
url=""; output=""
while (( $# )); do
  case "$1" in
    https://*) url="$1" ;;
    --output) shift; output="$1" ;;
  esac
  shift
done
name="\${url##*/}"
printf '%s\\n' "$url" >> "$REQUESTS"
if [[ "$name" == "\${FAIL_FILE:-}" ]]; then
  printf 'partial' > "$output"
  exit 22
fi
if [[ "$name" == "\${EMPTY_FILE:-}" ]]; then
  : > "$output"
else
  cp "$PAYLOAD/$name" "$output"
fi
`,
  );
  chmodSync(curl, 0o755);
  env = {
    ...process.env,
    HOME: work,
    TMPDIR: join(work, "downloads"),
    PATH: `${join(work, "bin")}:${process.env["PATH"]}`,
    PAYLOAD: packageDir,
    REQUESTS: join(work, "requests"),
  };
});

afterEach(() => rmSync(work, { recursive: true, force: true }));

function run() {
  // Execute code via stdin, as with curl ... | bash, with a profile argument.
  return Bun.spawnSync(["bash", "-s", "--", profile], {
    env,
    stdin: readFileSync(join(packageDir, "install-remote.sh")),
    stdout: "pipe",
    stderr: "pipe",
  });
}

test("piped code installs downloaded CSS and cleans up temporary files", () => {
  const result = run();
  expect(result.exitCode).toBe(0);
  expect(readFileSync(join(profile, "chrome/userChrome.css"))).toEqual(
    readFileSync(join(packageDir, "userChrome.css")),
  );
  expect(readFileSync(join(profile, "user.js"), "utf8")).toContain(
    'stylesheets", true',
  );
  const urls = readFileSync(join(work, "requests"), "utf8").trim().split("\n");
  expect(urls).toHaveLength(2);
  expect(urls[0]?.replace(/\/[^/]+$/, "")).toBe(
    urls[1]?.replace(/\/[^/]+$/, ""),
  );
  expect(readdirSync(join(work, "downloads"))).toEqual([]);
});

for (const name of ["install.sh", "userChrome.css"]) {
  test(`a failed ${name} download leaves existing profile files untouched`, () => {
    writeFileSync(join(profile, "user.js"), "// existing preferences\n");
    mkdirSync(join(profile, "chrome"));
    writeFileSync(
      join(profile, "chrome/userChrome.css"),
      "/* existing theme */",
    );
    env["FAIL_FILE"] = name;
    expect(run().exitCode).not.toBe(0);
    expect(readFileSync(join(profile, "user.js"), "utf8")).toBe(
      "// existing preferences\n",
    );
    expect(readFileSync(join(profile, "chrome/userChrome.css"), "utf8")).toBe(
      "/* existing theme */",
    );
    expect(readdirSync(join(work, "downloads"))).toEqual([]);
  });
}

test("an empty CSS download fails without changing the profile", () => {
  env["EMPTY_FILE"] = "userChrome.css";
  expect(run().exitCode).not.toBe(0);
  expect(existsSync(join(profile, "user.js"))).toBe(false);
  expect(existsSync(join(profile, "chrome"))).toBe(false);
  expect(readdirSync(join(work, "downloads"))).toEqual([]);
});
