# Contributing to Docklys

Thank you for your interest in contributing!

## Reporting Bugs

1. Check if the bug was already reported in [Issues](https://github.com/joaojpn/docklys-hosting/issues).
2. If not, open a new issue using the **Bug Report** template.
3. Be detailed — include steps to reproduce, expected behavior, and your environment.

## Suggesting Features

1. Check [Issues](https://github.com/joaojpn/docklys-hosting/issues) to avoid duplicates.
2. Open a new issue using the **Feature Request** template.
3. Explain the problem you're solving, not just the solution.

## Submitting Code

1. Fork the repository.
2. Create a branch from `main` following the naming convention below.
3. Make your changes — small, focused PRs are easier to review.
4. Open a Pull Request using the provided template.

## Branch Naming
```
feat/short-description      # new feature
fix/short-description       # bug fix
docs/short-description      # documentation only
chore/short-description     # maintenance, config, deps
refactor/short-description  # code refactoring
```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type | When to use |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `refactor` | Code change that's not a fix or feature |
| `chore` | Dependencies, config, build |

**Examples:**
```
feat(api): add GitHub OAuth login endpoint
fix(web): correct memory input validation in deploy form
chore(deps): bump fastify to 4.29
```

## Pull Request Process

1. Make sure your branch is up to date with `main`.
2. Ensure CI checks pass locally: `pnpm lint && pnpm build`
3. Fill in all sections of the PR template.
4. A maintainer will review and merge once approved.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## Questions?

If you have questions or need help getting started, join our [Discord community](https://discord.gg/ke5V4NeQ49).
