---
description: Run Stage 8 — PR & Release (writes CHANGELOG.md, generates sdlc-report.html, opens GitHub PR)
---

Invoke the sdlc-stage8-pr agent. Verify that verification-report.md shows PASS. Write a CHANGELOG.md entry with real numbers from verification-report.md. Generate sdlc-report.html as a self-contained pipeline summary page. Open a GitHub PR using `gh pr create` with a conventional commit title, pipeline status table, and real test metrics. After completing, print the Stage 8 completion message.

The PR body MUST include all five capstone sections: Summary, Changes Made, Test Evidence, Known Limitations, Reviewer Checklist. Generate `sdlc-report.html` from `.claude/templates/sdlc-report-template.html`. See skill `.claude/skills/sdlc-phase-8-pr/SKILL.md`, how-to `.claude/instructions/phase-08-pr.instructions.md`, and Gate 8 in `.claude/instructions/gate-validation-checklist.md`.
