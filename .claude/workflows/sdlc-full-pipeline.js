export const meta = {
  name: 'sdlc-full-pipeline',
  description: 'Run all 8 SDLC stages in sequence with human-in-the-loop gates between each stage',
  phases: [
    { title: 'State Check', detail: 'Detect which pipeline artifacts exist' },
    { title: 'Stage 1 — Requirements', detail: 'Generate requirements.md from user-story.md' },
    { title: 'Stage 2 — Architecture', detail: 'Design architecture.md from requirements.md' },
    { title: 'Stage 3 — Design Review', detail: 'Audit architecture → APPROVED/REJECTED' },
    { title: 'Stage 4 — Impl Plan', detail: 'Generate ordered task list in impl-plan.md' },
    { title: 'Stage 5 — Implementation', detail: 'Write code from impl-plan.md' },
    { title: 'Stage 6 — Code Review', detail: 'Review and fix code quality/security issues' },
    { title: 'Stage 7 — Verification', detail: 'Write E2E tests and run them' },
    { title: 'Stage 8 — PR & Report', detail: 'CHANGELOG, HTML report, GitHub PR' },
  ],
}

// ─── State Detection ──────────────────────────────────────────────────────────
phase('State Check')
const stateReport = await agent(
  `Check the project at the current working directory for these artifact files and report which exist:
  - user-story.md
  - requirements.md
  - architecture.md
  - design-review.md (note whether it says APPROVED or REJECTED)
  - impl-plan.md
  - verification-report.md (note whether verdict is PASS or FAIL)
  - CHANGELOG.md
  - sdlc-report.html

  Report as a JSON object with keys: hasUserStory, hasRequirements, hasArchitecture, designVerdict, hasImplPlan, hasVerificationReport, verificationVerdict, hasChangelog, hasSdlcReport`,
  {
    phase: 'State Check',
    schema: {
      type: 'object',
      properties: {
        hasUserStory: { type: 'boolean' },
        hasRequirements: { type: 'boolean' },
        hasArchitecture: { type: 'boolean' },
        designVerdict: { type: 'string', enum: ['APPROVED', 'REJECTED', 'NONE'] },
        hasImplPlan: { type: 'boolean' },
        hasVerificationReport: { type: 'boolean' },
        verificationVerdict: { type: 'string', enum: ['PASS', 'FAIL', 'NONE'] },
        hasChangelog: { type: 'boolean' },
        hasSdlcReport: { type: 'boolean' },
      },
      required: ['hasUserStory', 'hasRequirements', 'hasArchitecture', 'designVerdict',
                 'hasImplPlan', 'hasVerificationReport', 'verificationVerdict', 'hasChangelog', 'hasSdlcReport'],
    },
  }
)

log(`Pipeline state: ${JSON.stringify(stateReport, null, 2)}`)

if (!stateReport.hasUserStory) {
  log('ERROR: user-story.md not found. Create it before running the pipeline.')
  return { error: 'Missing user-story.md' }
}

// ─── Stage 1 — Requirements ───────────────────────────────────────────────────
if (!stateReport.hasRequirements) {
  phase('Stage 1 — Requirements')
  const s1 = await agent(
    'You are the sdlc-stage1-requirements agent. Read user-story.md and generate requirements.md with ≥10 FRs and ≥15 ACs in Given/When/Then format. Follow all instructions in .claude/agents/sdlc-stage1-requirements.md exactly.',
    { phase: 'Stage 1 — Requirements', agentType: 'sdlc-stage1-requirements' }
  )
  log(`Stage 1 result: ${s1}`)
} else {
  log('Stage 1: requirements.md already exists — skipping.')
}

// ─── Stage 2 — Architecture ───────────────────────────────────────────────────
if (!stateReport.hasArchitecture) {
  phase('Stage 2 — Architecture')
  const s2 = await agent(
    'You are the sdlc-stage2-architecture agent. Read requirements.md and the existing codebase, then produce architecture.md. Follow all instructions in .claude/agents/sdlc-stage2-architecture.md exactly.',
    { phase: 'Stage 2 — Architecture', agentType: 'sdlc-stage2-architecture' }
  )
  log(`Stage 2 result: ${s2}`)
} else {
  log('Stage 2: architecture.md already exists — skipping.')
}

// ─── Stage 3 — Design Review ──────────────────────────────────────────────────
if (stateReport.designVerdict !== 'APPROVED') {
  phase('Stage 3 — Design Review')
  const s3 = await agent(
    'You are the sdlc-stage3-design-review agent. Perform an adversarial review of architecture.md against requirements.md. Output design-review.md with an APPROVED or REJECTED verdict. Follow .claude/agents/sdlc-stage3-design-review.md exactly.',
    { phase: 'Stage 3 — Design Review', agentType: 'sdlc-stage3-design-review' }
  )
  log(`Stage 3 result: ${s3}`)
} else {
  log('Stage 3: design-review.md already APPROVED — skipping.')
}

// ─── Stage 4 — Implementation Plan ───────────────────────────────────────────
if (!stateReport.hasImplPlan) {
  phase('Stage 4 — Impl Plan')
  const s4 = await agent(
    'You are the sdlc-stage4-impl-plan agent. Read the APPROVED design-review.md and architecture.md, then produce impl-plan.md with ordered TASK-XX items. Follow .claude/agents/sdlc-stage4-impl-plan.md exactly.',
    { phase: 'Stage 4 — Impl Plan', agentType: 'sdlc-stage4-impl-plan' }
  )
  log(`Stage 4 result: ${s4}`)
} else {
  log('Stage 4: impl-plan.md already exists — skipping.')
}

// ─── Stage 5 — Implementation ─────────────────────────────────────────────────
phase('Stage 5 — Implementation')
const s5 = await agent(
  'You are the sdlc-stage5-implementation agent. Execute every TASK-XX from impl-plan.md in dependency order. Write TypeScript code to backend/src/ and frontend/src/. Never touch tests/e2e/. Follow .claude/agents/sdlc-stage5-implementation.md exactly.',
  { phase: 'Stage 5 — Implementation', agentType: 'sdlc-stage5-implementation' }
)
log(`Stage 5 result: ${s5}`)

// ─── Stage 6 — Code Review ────────────────────────────────────────────────────
phase('Stage 6 — Code Review')
const s6 = await agent(
  'You are the sdlc-stage6-review agent. Review all Stage 5 code changes for bugs, security issues, TypeScript errors, and convention violations. Apply safe fixes. Report PASS or BLOCKED. Follow .claude/agents/sdlc-stage6-review.md exactly.',
  { phase: 'Stage 6 — Code Review', agentType: 'sdlc-stage6-review' }
)
log(`Stage 6 result: ${s6}`)

// ─── Stage 7 — Verification ───────────────────────────────────────────────────
if (stateReport.verificationVerdict !== 'PASS') {
  phase('Stage 7 — Verification')
  const s7 = await agent(
    'You are the sdlc-stage7-verify agent. Write Playwright E2E tests covering all ACs from requirements.md. Run them against the live app. Write verification-report.md with real results only. Follow .claude/agents/sdlc-stage7-verify.md exactly.',
    { phase: 'Stage 7 — Verification', agentType: 'sdlc-stage7-verify' }
  )
  log(`Stage 7 result: ${s7}`)
} else {
  log('Stage 7: verification-report.md already shows PASS — skipping.')
}

// ─── Stage 8 — PR & Report ────────────────────────────────────────────────────
if (!stateReport.hasChangelog || !stateReport.hasSdlcReport) {
  phase('Stage 8 — PR & Report')
  const s8 = await agent(
    'You are the sdlc-stage8-pr agent. Write CHANGELOG.md entry and sdlc-report.html using real numbers from verification-report.md. Open a GitHub PR via gh CLI. Follow .claude/agents/sdlc-stage8-pr.md exactly.',
    { phase: 'Stage 8 — PR & Report', agentType: 'sdlc-stage8-pr' }
  )
  log(`Stage 8 result: ${s8}`)
} else {
  log('Stage 8: CHANGELOG.md and sdlc-report.html already exist — skipping.')
}

log('Pipeline complete — all 8 stages done.')
return { status: 'complete', stages: 8 }
