#!/usr/bin/env node
// Squash-merge the current branch's PR, delete the branch, and return to a fresh main.
// Usage: npm run land
import { run, capture, die, defaultBranch, assertGh, assertCleanTree, currentBranch } from "./_gitflow.mjs";

assertGh();
assertCleanTree();

const base = defaultBranch();
const branch = currentBranch();
if (branch === base) {
  die(`You are on ${base}; nothing to land. Switch to the feature branch you want to merge.`);
}

// Confirm a PR exists.
let prUrl;
try {
  prUrl = capture("gh", ["pr", "view", "--json", "url", "-q", ".url"]);
} catch {
  die(`No PR found for ${branch}. Run \`npm run pr\` first.`);
}

console.log(`\n▶ Squash-merging ${prUrl}`);
// --squash: one clean commit on main. --delete-branch: remove local + remote branch.
run("gh", ["pr", "merge", "--squash", "--delete-branch"]);

// Return to an up-to-date main.
console.log(`\n▶ Syncing ${base}`);
run("git", ["checkout", base]);
run("git", ["pull", "--ff-only", "origin", base]);

console.log(`\n✔ Merged and back on a fresh ${base}.\n`);
