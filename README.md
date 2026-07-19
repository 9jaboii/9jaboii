# CCArchPrep

> Original scenarios. Every option explained. Independent and unofficial.

CCArchPrep is a responsive practice platform for candidates preparing for the proposed Claude Certified Architect – Professional (CCAR-P) exam. It is designed around scenario questions, rationale-first learning, blueprint-weighted simulations, and “mold analytics” that explain which tempting reasoning pattern a learner selected—not merely which topic they missed.

**Status:** pre-alpha foundation. The public sample vertical slice is runnable; authentication, billing, persistent test sessions, and production analytics remain roadmap work.

> **Independence notice:** CCArchPrep is independent and is not affiliated with or endorsed by Anthropic. Claude and Anthropic are trademarks of their respective owner. The sample bank contains original editorial material—not recalled or real exam questions. Exam naming, blueprint, weights, and format must be verified against a canonical official guide before launch.

## Product at a glance

| Experience | Free | Annual — $59/year |
|---|---:|---:|
| Public sample with full rationale | Yes | Yes |
| Daily five-question single-domain test | Yes | — |
| Unlimited study and test modes | — | Yes |
| Full 63-question simulator | — | Yes |
| Domain trends and heatmap | Preview | Yes |
| Distractor-mold analytics | — | Yes |
| Ebook weak-domain remap | — | Yes |

The planned launch surface is responsive web. Native iOS and Android applications are not part of the v1 implementation unless the product decision changes.

## What is in this repository

```text
app/                         Next.js App Router foundation and public sample
bank/                        Original editorial samples and ebook remap template
docs/archprep-prd-review.md  Product, architecture, security, and delivery audit
docs/brand-system.md         Brand, voice, visual, screenshot, and a11y guidance
public/brand/                Editable CCArchPrep SVG identity assets
scripts/validate-bank.mjs    Zero-dependency content integrity gate
.github/workflows/ci.yml     Pull-request validation workflow
```

The existing ten questions are structurally complete samples, not an approved production bank. Each remains `awaiting_two_human_reviews` until it has official blueprint evidence, originality/NDA attestation, technical review, and two named human approvals.

## Quick start

### Prerequisites

- Node.js 22 LTS or newer
- npm 10 or newer
- Git

### Install and run

```bash
npm install
npm run validate:bank
npm run dev
```

Open <http://localhost:3000>. The homepage includes the interactive public sample; choose an answer and submit it to see the full rationale experience.

Package installation requires access to the npm registry. A lockfile will be committed as soon as dependencies can be installed in an approved network environment.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local Next.js development server |
| `npm run build` | Produce a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run Next.js/ESLint checks |
| `npm run typecheck` | Type-check without emitting files |
| `npm run validate:bank` | Validate question structure, keys, molds, and rationales |
| `npm test` | Run the currently available repository checks |

## Environment strategy

The public sample has no secrets. Later milestones will add `.env.example` entries for Supabase, Stripe, transactional email, rate limiting, monitoring, and analytics only when their integrations land.

Rules from the first integration:

1. Browser code receives only explicitly public configuration.
2. Supabase service-role and Stripe secrets remain in server-only modules.
3. No `.env*` file containing values is committed.
4. Production, preview, and local projects use separate credentials.
5. Every secret has an owner and rotation process.

## Question-bank workflow

1. Draft an original scenario with a named deciding constraint.
2. Provide one best answer, or exactly two for an explicitly multi-select item.
3. Give each incorrect option one allowed mold: `wrong_constraint`, `compensating_control`, `over_engineered`, or `plausible_myth`.
4. Explain the correct decision and every incorrect option.
5. Run `npm run validate:bank`.
6. Record canonical blueprint evidence and independent originality/NDA attestation.
7. Obtain two named human approvals before changing editorial status.
8. Publish a new immutable version; never edit a question version after learner exposure.

See [`bank/README.md`](bank/README.md) for the editorial checklist.

## Architecture guardrails

The implementation should preserve these non-negotiable controls from the architecture review:

- Never expose answer keys or unreleased rationales through a browser-readable question table or payload.
- The server creates sessions and derives correctness and mold hits; clients cannot assert analytics facts.
- Reserve free daily usage and create its session atomically.
- Store ordered session questions relationally and enforce one answer per session question.
- Keep subscription lifecycle state in server-owned billing tables, not user-editable profiles.
- Snapshot blueprint, question, and scoring versions for reproducible results.
- Enforce question immutability with database privileges/triggers, not editorial convention alone.

The full threat and schema review is in [`docs/archprep-prd-review.md`](docs/archprep-prd-review.md).

## Delivery plan

Work is gated by evidence and acceptance criteria rather than an unsupported date:

1. **Discovery:** canonical exam guide, legal review, launch geography, refund/tax policy, vendor ownership, staffing, and beta consent.
2. **Vertical slice:** public sample, authentication, atomic free test, server grading, rationale, and results.
3. **Beta gate:** observed tests with 10–15 target candidates and content-trust feedback.
4. **Paid core:** Stripe subscription lifecycle, portal, entitlement reconciliation, and support recovery.
5. **Simulator and analytics:** resumable timed sessions, expiry worker, heatmap, and qualified mold insights.
6. **Launch readiness:** approved bank by domain/difficulty, accessibility/security/load checks, restore drill, legal pages, monitoring, support runbooks, and launch content.

“ASAP” means shortening feedback loops and staffing parallel content/engineering work—not bypassing answer integrity, security, accessibility, or human editorial approval.

## GitHub repository setup

The intended hosted repository is **private**. After an authenticated GitHub owner and repository name are available:

```bash
# Example only; replace OWNER and confirm the final repository name.
gh repo create OWNER/ccarchprep --private --source=. --remote=origin --push
```

Then configure:

- `main` as the protected default branch;
- pull-request-only changes with required CI checks;
- secret scanning and dependency updates;
- CODEOWNERS review for `bank/`, migrations, billing, and security-sensitive modules;
- separate preview/staging/production vendor projects;
- no public question-bank history unless leadership explicitly accepts that commercial risk.

This working environment has neither the GitHub CLI nor an authenticated GitHub token, so it cannot safely create a hosted repository on the owner's behalf. Do not paste a token into an issue or chat; authenticate the CLI in the environment or create the private empty repository in GitHub and add its SSH/HTTPS remote.

## Brand assets

- [`public/brand/ccarchprep-mark.svg`](public/brand/ccarchprep-mark.svg)
- [`public/brand/ccarchprep-logo.svg`](public/brand/ccarchprep-logo.svg)
- [`public/brand/ccarchprep-social-card.svg`](public/brand/ccarchprep-social-card.svg)

Follow [`docs/brand-system.md`](docs/brand-system.md). The identity is intentionally warm and editorial but must not copy Anthropic's logo, proprietary typography, or trade dress or imply endorsement.

## Contributing and security

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a change. Report vulnerabilities privately using [`SECURITY.md`](SECURITY.md); do not file public issues containing secrets, user data, answer keys, or exploitable details.

## Required owner inputs

- GitHub owner/organization and final repository name
- Canonical official exam guide
- Launch countries, currency, refund policy, and Stripe Tax decision
- Stable ebook edition and chapter/stage deep links
- Named engineering, design, editorial, legal, and support owners with weekly availability
- Beta-list size and marketing-consent basis
- Organization-owned Vercel, Supabase, Stripe, DNS, email, monitoring, and optional analytics accounts

## License

All rights reserved unless and until leadership selects explicit software and content licenses. The question bank and brand assets must not be copied, redistributed, or used as training/evaluation data without written permission.
