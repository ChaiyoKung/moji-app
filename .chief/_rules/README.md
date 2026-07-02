# .chief/_rules/

Global rules that govern this project's autonomous AI work. Lower priority than `AGENTS.md`, higher than milestone goals.

## Categories

- `_standard/` — Coding standards, architecture constraints
- `_contract/` — Data models, API contracts, schemas
- `_goal/` — High-level goals (shared across milestones)
- `_verification/` — Test commands, build requirements, definition of done

Subfolders are created **lazily** — on first rule in that category. Empty subfolders are not required.

Use `/chief-rule` to add rules proactively, or `/chief-retro` to capture them after a milestone retrospective.
