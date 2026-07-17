#!/usr/bin/env node
// Create a GitHub issue, then a branch named "<issue#>-<slug>" off a fresh main,
// and check it out. Usage:
//   npm run issue -- "Fix 404 page contrast" ["longer body..."] [--label bug]
import { run, capture, die, slugify, defaultBranch, assertCleanTree, assertGh } from "./_gitflow.mjs";

const argv = process.argv.slice(2);
const passThrough = [];
const positional = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith("--")) {
    passThrough.push(argv[i]);
    if (argv[i + 1] && !argv[i + 1].startsWith("--")) passThrough.push(argv[++i]);
  } else {
    positional.push(argv[i]);
  }
}

const [title, body] = positional;
if (!title) {
  die('Usage: npm run issue -- "Issue title" ["body"] [--label bug]');
}

assertGh();
assertCleanTree();

const base = defaultBranch();

// 1. Create the issue and capture its URL/number.
console.log(`\n▶ Creating issue: ${title}`);
const ghArgs = ["issue", "create", "--title", title, "--body", body || "_No description provided._", ...passThrough];
const issueUrl = capture("gh", ghArgs);
const issueNumber = issueUrl.split("/").pop();
console.log(`  #${issueNumber} → ${issueUrl}`);

// 2. Refresh main so the branch starts from up-to-date history.
console.log(`\n▶ Updating ${base}`);
run("git", ["checkout", base]);
run("git", ["pull", "--ff-only", "origin", base]);

// 3. Create + check out the branch.
const branch = `${issueNumber}-${slugify(title)}`;
console.log(`\n▶ Creating branch: ${branch}`);
run("git", ["checkout", "-b", branch]);

console.log(`\n✔ On branch ${branch} for issue #${issueNumber}. Start committing.\n`);
