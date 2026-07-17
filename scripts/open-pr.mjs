#!/usr/bin/env node
// Push the current branch and open a PR that auto-closes its issue on merge.
// The issue number is parsed from the branch name ("<issue#>-<slug>").
// Usage: npm run pr -- ["PR title override"]
import { run, capture, die, defaultBranch, assertGh, currentBranch } from "./_gitflow.mjs";

assertGh();

const base = defaultBranch();
const branch = currentBranch();
if (branch === base) {
  die(`You are on ${base}. Switch to a feature branch first (npm run issue -- "...").`);
}

const match = branch.match(/^(\d+)-/);
const issueNumber = match ? match[1] : null;

const titleOverride = process.argv.slice(2).join(" ").trim();

// Push the branch and set upstream.
console.log(`\n▶ Pushing ${branch}`);
run("git", ["push", "-u", "origin", branch]);

// Body: "Closes #N" makes GitHub close the issue when the PR merges.
const body = issueNumber
  ? `Closes #${issueNumber}\n`
  : "_No linked issue (branch is not named `<issue#>-slug`)._\n";

const prArgs = ["pr", "create", "--base", base, "--head", branch, "--body", body, "--fill"];
if (titleOverride) {
  prArgs.push("--title", titleOverride);
}

console.log(`\n▶ Opening PR against ${base}`);
let prUrl;
try {
  prUrl = capture("gh", prArgs);
} catch {
  // A PR may already exist for this branch — surface it instead of erroring out.
  prUrl = capture("gh", ["pr", "view", "--json", "url", "-q", ".url"]);
  console.log("  (PR already existed)");
}
console.log(`\n✔ PR ready: ${prUrl}`);
if (issueNumber) console.log(`  Will close issue #${issueNumber} on merge.\n`);
