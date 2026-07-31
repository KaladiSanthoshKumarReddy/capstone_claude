---
description: Run Stage 8 — PR & Release (writes CHANGELOG.md, generates sdlc-report.html, opens GitHub PR)
---

Invoke the sdlc-stage8-pr agent. Verify that verification-report.md shows PASS. Write a CHANGELOG.md entry with real numbers from verification-report.md. Generate sdlc-report.html as a self-contained pipeline summary page. Open a GitHub PR using `gh pr create` with a conventional commit title, pipeline status table, and real test metrics. After completing, print the Stage 8 completion message.
