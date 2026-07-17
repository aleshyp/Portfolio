# Development Workflow

Every change follows the same path: **issue → branch → commits → PR → squash-merge into `main`**.
Three npm scripts automate the mechanical parts (they run the same in PowerShell, Git Bash, and CI).

> Prerequisites: [GitHub CLI](https://cli.github.com/) authenticated (`gh auth status`).

---

## 1. Start work — create an issue + branch

```bash
npm run issue -- "Fix 404 page contrast" "Body text is only 3.76:1, below WCAG AA." --label bug
```

This:
1. Opens a GitHub **issue** and captures its number.
2. Checks out `main` and pulls the latest.
3. Creates and checks out a branch named **`<issue#>-<slug>`** (e.g. `12-fix-404-page-contrast`).

- The **title** is required; the **body** and any `--label`/other `gh issue create` flags are optional.
- Requires a clean working tree (commit/stash first).

## 2. Do the work — commit as you go

Normal git. Small, focused commits:

```bash
git add -A
git commit -m "Raise 404 body text to fg-muted for AA contrast"
```

Follow this repo's commit style; end AI-assisted commits with the `Co-Authored-By` trailer.

## 3. Open a pull request

```bash
npm run pr
```

This pushes the branch and opens a PR against `main` with **`Closes #<issue>`** in the body (parsed
from the branch name), so merging the PR auto-closes the issue. Pass an argument to override the PR
title: `npm run pr -- "Custom PR title"`. Re-running on an existing PR just prints its URL.

## 4. Land it — squash-merge into main

Once the PR is green and reviewed:

```bash
npm run land
```

This squash-merges the PR (one clean commit on `main`), deletes the local + remote branch, and
returns you to an up-to-date `main`. The linked issue closes automatically.

---

## At a glance

| Stage      | Command                                  | Result                                    |
| ---------- | ---------------------------------------- | ----------------------------------------- |
| Start      | `npm run issue -- "Title" ["body"]`      | Issue created, branch `<#>-slug` checked out |
| Work       | `git commit …`                           | Focused commits on the branch             |
| Review     | `npm run pr`                             | PR opened, `Closes #<issue>`              |
| Land       | `npm run land`                           | Squash-merged, branch deleted, on fresh `main` |

## Conventions

- **Branch names:** `<issue#>-<slug>` — every branch ties to an issue.
- **Merge:** squash, so `main` history is one commit per issue.
- **Never commit straight to `main`** — always go through a branch + PR.
- Run the relevant **Review / Test / Security Pass** (see `CLAUDE.md`) before `npm run land`.
