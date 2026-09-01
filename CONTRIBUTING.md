# Contributing

## Setup

```bash
npm install
npm start
```

## Before opening a PR

Run the full check suite locally — it's the same sequence `ci.yml` runs:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

A pre-commit hook (husky + lint-staged) already runs eslint, prettier, and
`typecheck` automatically on every commit, so most of this should already
be clean by the time you're ready to open a PR.

## Branching and PR base

This repo uses a release-branch flow: **`release/1.0.0` is the actual PR
base, not `main`**. `main` only moves when the release branch is merged
into it, at which point `deploy.yml` publishes the site. Before opening a
PR, make sure your branch is based on `release/1.0.0` and that you're
targeting it, not `main`:

```bash
git checkout release/1.0.0
git pull
git checkout -b your-branch-name
```

`gh pr create` with no `--base` targets the repo's default branch
(`main`), which is the wrong target for day-to-day work — pass
`--base release/1.0.0` explicitly.

## Commit convention

[Conventional Commits](https://www.conventionalcommits.org/)
(`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`). Run
`npm run commit` for an interactive prompt that formats this for you.

## Adding a new printable object

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the `PrintObject`
plugin contract and how to register a new object in the catalog.
