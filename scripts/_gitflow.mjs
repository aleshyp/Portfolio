// Shared helpers for the issue → branch → PR → merge workflow scripts.
// Cross-platform (Node), so it behaves the same in PowerShell, Git Bash, and CI.
import { execFileSync } from "node:child_process";

/** Run a command, inheriting stdio so prompts/output stream to the user. Throws on failure. */
export function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { stdio: "inherit", ...opts });
}

/** Run a command and return its trimmed stdout (no streaming). */
export function capture(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: "utf8", ...opts }).trim();
}

/** Exit with a friendly message instead of a stack trace. */
export function die(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

/** Turn a free-text title into a git-safe slug: "Fix 404 contrast!" -> "fix-404-contrast". */
export function slugify(text, maxLen = 50) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLen)
    .replace(/-+$/g, "");
}

/** The repo's default branch (main), read from the remote once. */
export function defaultBranch() {
  try {
    return capture("gh", ["repo", "view", "--json", "defaultBranchRef", "-q", ".defaultBranchRef.name"]);
  } catch {
    return "main";
  }
}

/** Fail early if the working tree has uncommitted changes. */
export function assertCleanTree() {
  const status = capture("git", ["status", "--porcelain"]);
  if (status) {
    die("You have uncommitted changes. Commit or stash them first, then re-run.");
  }
}

/** Ensure gh is installed and authenticated. */
export function assertGh() {
  try {
    execFileSync("gh", ["auth", "status"], { stdio: "ignore" });
  } catch {
    die("GitHub CLI (gh) is not authenticated. Run `gh auth login` first.");
  }
}

export function currentBranch() {
  return capture("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
}
