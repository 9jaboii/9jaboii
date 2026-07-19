# Contributing

CCArchPrep uses pull requests for every change. Keep changes small, explain user impact and risk, and never include secrets, personal data, recalled exam material, or unapproved answer-bank content.

## Before opening a pull request

```bash
npm run validate:bank
npm run typecheck
npm run lint
npm run build
```

Add automated tests for behavior changes. Include keyboard and narrow-screen checks for user-facing flows. Question changes require the editorial evidence and approvals in `bank/README.md`; changes to migrations, authorization, billing, or deletion require a threat-model note and designated owner review.

Use conventional, imperative commit summaries such as `Add server-side session grading`. A pull request should state what changed, why, test evidence, screenshots for perceptible UI changes, rollout/migration notes, and unresolved risks.
