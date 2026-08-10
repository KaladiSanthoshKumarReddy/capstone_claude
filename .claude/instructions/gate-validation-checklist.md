# Gate Validation Checklist — Capstone Item Manager AI SDLC

Objective, evidence-based PASS/FAIL rules for each stage gate. A gate is:
- **PASS** — every required check is satisfied (proceed to next stage on human approval).
- **FAIL** — one or more checks fail (re-run the stage).
- **BLOCKED** — required input artifact is missing (cannot start the stage yet).

Use the reusable **Gate Decision Form** at the bottom to record each verdict.

---

## Gate 1 — Requirements (`requirements.md`)
| # | Required check | Evidence |
|---|----------------|----------|
| 1 | Artifact exists & non-empty | file present |
| 2 | ≥ 10 numbered Functional Requirements ("The system SHALL…") | FR count |
| 3 | ≥ 3 Non-Functional Requirements | NFR count |
| 4 | ≥ 15 testable Acceptance Criteria (Given/When/Then) | AC count |
| 5 | Every FR → ≥ 1 AC; every AC → ≥ 1 FR | traceability matrix |
| 6 | Scope + Out-of-Scope stated | section present |
| 7 | No vague/placeholder criteria | manual scan |

## Gate 2 — Architecture (`architecture.md`)
| # | Required check | Evidence |
|---|----------------|----------|
| 1 | Artifact exists & non-empty | file present |
| 2 | ≥ 80% FR traceability (100% preferred) | traceability matrix |
| 3 | Component diagram + ≥ 1 sequence diagram | Mermaid blocks |
| 4 | DB changes additive only (no DROP) + migration strategy | schema section |
| 5 | Every endpoint: method/path/auth/body/response | API table |
| 6 | ≥ 1 ADR with trade-offs | ADR section |
| 7 | OWASP analysis present; new deps justified | security section |

## Gate 3 — Design Review (`design-review.md`)
| # | Required check | Evidence |
|---|----------------|----------|
| 1 | Explicit verdict `APPROVED` or `REJECTED` | verdict line |
| 2 | All 6 dimensions evaluated (FR coverage, API, DB, security, conventions, completeness) | summary table |
| 3 | Every CRITICAL finding has dimension + description + fix | findings section |
| 4 | Traceability verification complete | table |
| PASS = APPROVED with 0 CRITICAL. REJECTED → loop to Stage 2. |

## Gate 4 — Implementation Plan (`impl-plan.md`)
| # | Required check | Evidence |
|---|----------------|----------|
| 1 | Artifact exists | file present |
| 2 | Every task: id + file target + description + deps + success criteria + FR coverage | task list |
| 3 | Every FR covered by ≥ 1 task | FR→Task matrix |
| 4 | Topologically valid order (DB → routes → client → components); no cycles | order section |
| 5 | No task touches `tests/e2e/**` | scan |
| 6 | Blocked tasks flagged with blocker | task list |

## Gate 5 — Implementation (code)
| # | Required check | Evidence |
|---|----------------|----------|
| 1 | ≥ 80% plan tasks done (100% target) | task report |
| 2 | `npx tsc --noEmit` = 0 errors (backend + frontend) | tsc output |
| 3 | No hardcoded secrets/URLs/tokens | grep/scan |
| 4 | Parameterized SQL + Zod before writes | code review |
| 5 | No `tests/e2e/**` modified | git diff |
| 6 | `data-testid` on new interactive elements | code scan |

## Gate 6 — Code Review (report + fixes)
| # | Required check | Evidence |
|---|----------------|----------|
| 1 | All 7 review areas evaluated (correctness, security, error handling, test coverage, clarity, DRY, deps) | report |
| 2 | Both workspaces compile (0 errors) | tsc output |
| 3 | All CRITICAL findings fixed or documented as accepted risk | findings |
| 4 | No hardcoded secrets remain | scan |
| PASS = 0 unresolved CRITICAL. |

## Gate 7 — Verification (`verification-report.md`)
| # | Required check | Evidence |
|---|----------------|----------|
| 1 | 100% AC coverage (every AC → ≥ 1 test) | AC traceability |
| 2 | All tests pass (E2E + unit) | real runner output |
| 3 | Content-quality check of output document passes | content-quality section |
| 4 | Report numbers match actual runner output; no fabrication | cross-check |
| 5 | No `waitForTimeout` in specs | scan |

## Gate 8 — PR & Release (`CHANGELOG.md` + `sdlc-report.html` + PR)
| # | Required check | Evidence |
|---|----------------|----------|
| 1 | CHANGELOG `[Unreleased]` entry with real test numbers | file |
| 2 | `sdlc-report.html` complete, no placeholders | file |
| 3 | PR body has all 5 sections: Summary, Changes Made, Test Evidence, Known Limitations, Reviewer Checklist | PR body |
| 4 | PR opened (or body printed for manual open) | gh output |

---

## Gate Decision Form (record for each gate)
```
- Stage:
- Artifact status: PRESENT | MISSING
- Required checks (list each PASS/FAIL):
- Evidence references:
- Verdict: PASS | FAIL | BLOCKED
- Next action:
```
