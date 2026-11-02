import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Contract tests for install.sh's interactive profile selection: each test
// runs the real script against a fake $HOME in a temp directory. Nothing
// outside the temp directory is touched.

const installSh = fileURLToPath(new URL("../install.sh", import.meta.url));
const userChromeCss = readFileSync(
  fileURLToPath(new URL("../userChrome.css", import.meta.url)),
);

let work: string;
let home: string;

function runInstall(input: string | null, args: string[] = []) {
  return Bun.spawnSync(["bash", installSh, ...args], {
    env: { ...process.env, HOME: home },
    stdin: input === null ? null : Buffer.from(input),
    stdout: "pipe",
    stderr: "pipe",
  });
}

function makeProfile(path: string) {
  mkdirSync(path, { recursive: true });
  writeFileSync(join(path, "prefs.js"), "");
}

function installedCss(profile: string) {
  const dest = join(profile, "chrome", "userChrome.css");
  return existsSync(dest) && readFileSync(dest).equals(userChromeCss);
}

function installedPref(profile: string) {
  return readFileSync(join(profile, "user.js"), "utf8").includes(
    'user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);',
  );
}

beforeEach(() => {
  work = mkdtempSync(join(tmpdir(), "fxc-install-"));
  home = join(work, "home");
  mkdirSync(home, { recursive: true });
});

afterEach(() => {
  rmSync(work, { recursive: true, force: true });
});

describe("with two detected profiles", () => {
  let profileA: string;
  let profileB: string;

  beforeEach(() => {
    profileA = join(home, ".mozilla/firefox/aaaa1111.default");
    profileB = join(home, ".mozilla/firefox/bbbb2222.default-release");
    makeProfile(profileA);
    makeProfile(profileB);
    writeFileSync(
      join(home, ".mozilla/firefox/profiles.ini"),
      `[Install4F96D1932A9F858E]
Default=bbbb2222.default-release
Locked=1

[Profile1]
Name=perso
IsRelative=1
Path=aaaa1111.default

[Profile0]
Name=default-release
IsRelative=1
Path=bbbb2222.default-release
Default=1
`,
    );
  });

  test("a numeric choice installs into the chosen profile only", () => {
    const result = runInstall("1\n");
    expect(result.exitCode).toBe(0);
    expect(installedCss(profileA)).toBe(true);
    expect(installedCss(profileB)).toBe(false);
  });

  test("Enter alone installs into the default profile", () => {
    const result = runInstall("\n");
    expect(result.exitCode).toBe(0);
    expect(installedCss(profileB)).toBe(true);
  });

  test("a path pasted at the prompt is honored", () => {
    const manual = join(work, "elsewhere");
    makeProfile(manual);
    const result = runInstall(`${manual}\n`);
    expect(result.exitCode).toBe(0);
    expect(installedCss(manual)).toBe(true);
  });

  test("an out-of-range number fails without writing", () => {
    const result = runInstall("9\n");
    expect(result.exitCode).not.toBe(0);
    expect(existsSync(join(profileA, "chrome"))).toBe(false);
    expect(existsSync(join(profileB, "chrome"))).toBe(false);
  });

  test("EOF (closed stdin) cancels cleanly", () => {
    const result = runInstall(null);
    expect(result.exitCode).not.toBe(0);
    expect(existsSync(join(profileA, "chrome"))).toBe(false);
  });

  test("a profile from a second Firefox install is selectable", () => {
    const snapBase = join(home, "snap/firefox/common/.mozilla/firefox");
    const snapProfile = join(snapBase, "cccc3333.snap");
    makeProfile(snapProfile);
    writeFileSync(
      join(home, ".mozilla/firefox/profiles.ini"),
      `[Profile0]
Name=deb
IsRelative=1
Path=aaaa1111.default
Default=1
`,
    );
    writeFileSync(
      join(snapBase, "profiles.ini"),
      `[Profile0]
Name=snap
IsRelative=1
Path=cccc3333.snap
`,
    );
    const result = runInstall("1\n");
    expect(result.exitCode).toBe(0);
    expect(installedCss(snapProfile)).toBe(true);
  });
});

describe("without profiles.ini", () => {
  test("the manual path fallback prompt installs there", () => {
    const fallback = join(work, "fallback");
    makeProfile(fallback);
    const result = runInstall(`${fallback}\n`);
    expect(result.exitCode).toBe(0);
    expect(installedCss(fallback)).toBe(true);
  });

  test("an empty answer cancels without writing", () => {
    const result = runInstall("\n");
    expect(result.exitCode).not.toBe(0);
  });
});

describe("with a profile directory argument", () => {
  let direct: string;

  beforeEach(() => {
    direct = join(work, "direct");
    makeProfile(direct);
  });

  test("installs directly, no prompt needed", () => {
    const result = runInstall(null, [direct]);
    expect(result.exitCode).toBe(0);
    expect(installedCss(direct)).toBe(true);
  });

  test("backs up existing files and rewrites the pref exactly once", () => {
    writeFileSync(
      join(direct, "user.js"),
      'user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", false);\n',
    );
    mkdirSync(join(direct, "chrome"), { recursive: true });
    writeFileSync(
      join(direct, "chrome", "userChrome.css"),
      "/* old theme */\n",
    );

    const result = runInstall(null, [direct]);
    expect(result.exitCode).toBe(0);
    expect(installedCss(direct)).toBe(true);
    expect(
      readdirSync(join(direct, "chrome")).some((f) =>
        f.startsWith("userChrome.css.bak."),
      ),
    ).toBe(true);
    expect(readdirSync(direct).some((f) => f.startsWith("user.js.bak."))).toBe(
      true,
    );
    expect(installedPref(direct)).toBe(true);
    const occurrences =
      readFileSync(join(direct, "user.js"), "utf8").split(
        "legacyUserProfileCustomizations",
      ).length - 1;
    expect(occurrences).toBe(1);
  });
});
