# `.claude/instructions/` — SDLC Instruction Library

Detailed, human-readable how-to guidance for each SDLC stage of the Capstone Item Manager pipeline.
These files are the deep reference that the stage **agents** (`.claude/agents/`) and **skills**
(`.claude/skills/`) point to. They complement — they do not replace — the shorter, executable
agent/skill definitions.

## Files
| File | Purpose |
|------|---------|
| `sdlc-global.instructions.md` | Cross-stage policy: gates, security, conventions, honesty rule |
| `gate-validation-checklist.md` | Objective PASS/FAIL criteria for all 8 gates + decision form |
| `phase-01-requirements.instructions.md` | Requirements extraction + clarifying-question technique |
| `phase-02-architecture.instructions.md` | Architecture design method for this stack |
| `phase-03-design-review.instructions.md` | 6-dimension adversarial review rubric |
| `phase-04-impl-plan.instructions.md` | Task decomposition + dependency ordering |
| `phase-05-implementation.instructions.md` | Full coding standards (deepest file) |
| `phase-06-review.instructions.md` | 7-area code-review checklist + safe-fix rules |
| `phase-07-verify.instructions.md` | Test authoring + content-quality verification |
| `phase-08-pr.instructions.md` | CHANGELOG, HTML report, and PR construction |

## How the layers fit together
```
Command (.claude/commands)  →  entry point the human types (/sdlc-stage5)
      │
Agent (.claude/agents)      →  executes the stage, delegated by the orchestrator
      │
Skill (.claude/skills)      →  reusable gate criteria + core steps, auto-surfaced by relevance
      │
Instructions (this folder)  →  the detailed how-to reference each stage reads for depth
      │
Hooks (.claude/settings.json) → enforce safety + print gate reminders on tool events
```

## Reading order for a new contributor
1. `sdlc-global.instructions.md` (the rules of the game)
2. `gate-validation-checklist.md` (how each gate is judged)
3. The specific `phase-0N-*.instructions.md` for the stage you are running
