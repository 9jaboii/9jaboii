# CCArchPrep PRD review and decision log

**Review status:** discovery draft, owner decisions incorporated
**Source:** PRD v0.9, July 2026  
**Purpose:** record the decisions required before implementation and turn the PRD into a buildable, testable plan.

## Executive assessment

CCArchPrep has a clear audience, a strong conversion moment (the public sample question), and a credible content-led differentiator (distractor-mold analytics). The proposed managed stack is appropriate for a small team. The current PRD is not implementation-ready, however: the exam blueprint and name need authoritative/legal verification; platform scope still conflicts; the data model exposes answer-key and grading-integrity risks; and the eight-week plan understates the editorial workload.

The recommended sequence is:

1. Resolve the remaining blocking product, legal, ownership, and content questions below.
2. Verify the exam name, blueprint, format, timing, and trademark usage against authoritative sources and retain dated evidence.
3. Freeze a v1 product contract and acceptance criteria.
4. Build a thin vertical slice: public sample → sign-up → five-question test → result and rationale.
5. Validate that slice with 10–15 target users before committing to simulator, advanced analytics, or 150 launch items.

## Confirmed owner decisions

- **Brand:** CCArchPrep.
- **Price:** one annual plan at **$59/year**; no monthly or lifetime SKU is assumed for v1.
- **Repository:** a new private GitHub repository.
- **Visual direction:** an Anthropic-adjacent warm editorial palette, without copying Anthropic logos, typefaces, or protected trade dress.
- **Schedule:** launch as soon as the product and content readiness gates are met; quality and security gates do not move to satisfy a calendar date.

## Remaining blocking questions for the owner

### Product and market

1. **Official source:** What is the canonical, dated Anthropic source for the CCAR-P name, seven domains, weights, 63-question format, and 120-minute duration? Please provide the exam guide or URL. No blueprint claim should ship until this is verified.
2. **Launch surface:** Is v1 responsive web only? The summary says web/mobile (iOS and Android), while the non-goals defer mobile apps.
3. **Geography:** Which countries are in the initial sales market? This controls tax, consumer-cancellation, privacy, and email requirements.
4. **Beta evidence:** How many ebook readers or Mock B downloaders may legally be contacted, and what consent was captured for product email?
5. **Ebook integration:** Where is the ebook hosted, what are its stable chapter/stage URLs, and is it included with the subscription or sold separately?

### Brand, legal, and content rights

6. **Domain and handles:** Which domain is owned for CCArchPrep, and are the relevant social handles available? Domain availability is not the same as trademark clearance.
7. **Legal review:** Who will approve `CCArchPrep`, nominative trademark use, disclaimer placement, privacy terms, refund/cancellation terms, and the no-dumps content policy?
8. **Question provenance:** What evidence will be retained for human authorship/review, source references, reviewer identity, and sign-off for every item?
9. **Sensitive source material:** Will authors/reviewers attest that they did not use recalled live-exam questions, dumps, or material covered by an exam NDA?

### Commercial model

10. **Entitlement:** What happens to analytics after annual access expires, cancellation, refund, dispute, or failed renewal?
11. **Refunds and trial:** What is the refund policy? Is the free daily test the complete trial, or is a paid trial planned?
12. **Tax and currency:** Will Stripe Tax be enabled, which currency is charged, and are tax-inclusive prices required in launch markets?

### Delivery and operations

13. **Team capacity:** Who is the engineer, designer, question author, two content reviewers, legal reviewer, and support owner, and how many hours per week does each have?
14. **GitHub destination:** Which GitHub owner/organization should hold the private repository, and what repository name/default branch/branch protection are required?
15. **Vendor ownership:** Which organization-owned accounts will own GitHub, Vercel, Supabase, Stripe, email, analytics, error monitoring, and the domain?
16. **Support:** What response-time target and escalation process applies to billing problems, account deletion, and disputed questions?

## Contradictions to resolve in PRD v1.0

| Area | Current conflict | Proposed v1 decision |
|---|---|---|
| Platform | Summary promises web/mobile; non-goals say responsive web only | Say “responsive web application”; native apps are v2 |
| Brand | §1 recommends ArchPrep; §12 asks for ClaudeArchitectPrep sign-off | Replace both with CCArchPrep, subject to legal clearance |
| Price | `$59/year` vs `$19/month` vs `$49 lifetime` | Use one $59/year SKU; remove monthly and lifetime launch copy |
| Launch content | Goals say 150 at launch and 200 within 60 days; composition and marketing sometimes say 200/150+ | Define a minimum count per domain and a dated content ramp |
| SEO output | Milestones say six launch articles; GTM says twelve launch articles | Specify six at launch plus six during the first three weeks |
| Weights | Item counts, 63-question allocation, and percentage copy use different orderings/rounding | Store a versioned blueprint config backed by the official guide |
| Admin | Scope table calls F13 an admin CMS; engineering specifies only a read-only flags page | Rename v1 feature to “editorial pipeline and flag queue” |
| Deletion | “Anonymize immediately” conflicts with a 30-day recoverable soft delete | Choose recoverable deactivation or immediate anonymization; document exceptions for billing records |
| Secrets | Architecture claims three environment variables but later adds Supabase public config, Stripe price, KV, cron, and other services | Maintain a complete environment-variable inventory and owner/rotation policy |

## Architecture and security audit

### Critical changes before implementation

1. **Do not grant clients direct reads on the base `questions` table.** A table-level `SELECT` policy exposes `correct_keys` and `rationale`; a browser can request those columns even if the UI does not. Serve a deliberately shaped question payload from a server route/RPC, and return explanations only under the mode/completion rules.
2. **Do not allow client-created sessions or attempts.** The proposed `test_sessions for all` and `attempts for insert` policies let a user choose question IDs, submit arbitrary correctness/mold values, and corrupt analytics. Session creation and grading should be server-owned transactions. Clients may read their own sanitized session state.
3. **Separate billing authority from the editable profile.** Put Stripe customer/subscription status in a server-only `billing_accounts`/`subscriptions` table. Do not rely on a self-referential profile policy to protect one sensitive column.
4. **Make free-use reservation atomic.** In one transaction, reserve `(user_id, usage_date)`, select/freeze questions, and create the session. A unique constraint should decide concurrent requests; do not perform a check-then-insert race.
5. **Model session questions relationally.** Replace the `question_ids uuid[]` state bucket with `session_questions(session_id, question_id, position, question_version, flagged_at, presented_at)`. This supports ordering, flags, unanswered review, resumability, constraints, and queries without array surgery.
6. **Enforce one answer per session question.** Add a unique constraint and grade in a server transaction. The server derives `is_correct` and `molds_hit`; neither value is accepted from the client.
7. **Implement actual immutability.** A convention is insufficient. Add database triggers/privileges preventing edits to exposed question versions, track `published_at`/`retired_at`, and create a new version for editorial changes.
8. **Model subscription lifecycle, not a binary plan.** Persist Stripe customer/subscription IDs, product/price, status, current-period end, cancel-at-period-end, and last synchronized event. Grant access from an explicit entitlement function. Handle renewals, failures, refunds, disputes, out-of-order events, and reconciliation.

### Recommended schema additions

- `blueprints` and `blueprint_domains` for versioned exam weights and format.
- `question_versions` (or current `questions` rows with an immutable stable parent) and `question_reviews` for provenance and approvals.
- `session_questions` and `session_answers` for ordered, auditable test state.
- `subscriptions`, `stripe_events`, and `entitlement_overrides` for support-safe billing.
- `user_onboarding`, or explicit consent/source fields if onboarding data powers marketing email.
- `question_reports` with category, free-text detail, workflow status, assignee, resolution, and timestamps.
- `account_deletion_requests` with state and scheduled execution time.
- `audit_events` for privileged editorial, billing, and deletion actions (never store answer content or unnecessary personal data).

### Timing, scoring, and selection rules to specify

- Define the product timezone for “daily” usage, countdown behavior, daylight-saving changes, and travel. A user-selected IANA timezone is more understandable than an implicit database date.
- Define abandon/resume/expiry behavior and whether reserving a test consumes the daily allowance. A short unstarted-session release window can reduce accidental lockouts.
- Decide whether simulation answers may be changed before submission and how late network requests are treated.
- Add a server-side finalize operation and a scheduled expiry job. “Auto-submit after deadline” cannot depend on another PATCH arriving.
- Define multi-select scoring (all-or-nothing is simplest), unanswered scoring, rounding, and the denominator shown in domain analytics.
- Clarify selection priority: “least recently seen, then previously missed” conflicts with a “missed-first” test description. Use a deterministic policy with seeded random tie-breaking and test it.
- Define behavior when a selected domain lacks enough live, unseen questions. The engine must degrade predictably without duplicates.
- Snapshot the blueprint version, question version, and scoring version on each session so historical results remain reproducible.

### Privacy, security, and reliability improvements

- Create a data inventory and retention schedule for profile data, attempts, IP-derived rate-limit data, Stripe records, support messages, analytics events, and backups.
- Hashing an IP does not necessarily make it anonymous. Use a rotating keyed HMAC, short retention, documented purpose, and a privacy review.
- Public avatar buckets expose stable user imagery. Prefer private objects with signed URLs unless public access is an explicit user choice; strip metadata and validate decoded image content.
- Use a nonce- or hash-based Content Security Policy rather than broad script allowances. Add `Permissions-Policy`, `X-Content-Type-Options`, and `frame-ancestors`; test headers in preview and production.
- Add CSRF/origin protection to state-changing routes, webhook raw-body signature verification, replay/idempotency controls, and structured authorization tests.
- Add error monitoring, uptime checks, database backups/restore drills, webhook dead-letter visibility, support runbooks, and explicit recovery objectives.
- Reconcile Stripe nightly, but also expose a user-triggered “refresh purchase” path so a missed webhook does not leave a buyer blocked overnight.
- Inventory all configuration rather than promising “three secrets.” Public values still require environment-specific management, and server secrets require rotation and access controls.

## Product and analytics enhancements

### Preserve the strongest v1 wedge

The public sample should be the first vertical slice and the primary research instrument. Instrument only the essential funnel:

`landing_view → sample_started → sample_answered → rationale_viewed → signup_started → signup_completed → daily_test_started → daily_test_completed → paywall_viewed → checkout_started → purchase_completed`

Define each event, its properties, its lawful basis/consent treatment, and an owner before implementation. Avoid recording question stems, email addresses, or answer selections in a general analytics vendor.

### Make “mold analytics” statistically honest

- Show counts and confidence thresholds; suppress claims based on tiny samples.
- Compare a user with an appropriate cohort only after minimum cohort size and data volume are met.
- Prefer actionable language (“You selected compensating-control distractors on 4 of 11 eligible wrong answers”) over diagnostic language (“how you think wrong”).
- Explain denominator and eligibility. A mold rate must distinguish opportunities presented from wrong answers selected.
- Validate mold labels with reviewer agreement; otherwise the moat is noisy metadata.
- Let users inspect the underlying attempts and provide a plain-language “how calculated” panel.

### Strengthen content operations

Every question version should have:

- original-author and reviewer attestations;
- blueprint source/version and learning objective;
- scenario constraint, correct-answer defense, and option-level rationales;
- option-level mold labels for incorrect options only;
- difficulty rubric and select-two pairing rationale;
- factual/source references with a “verified on” date;
- editorial status transitions (`draft → technical_review → editorial_review → approved → live → retired`);
- exposure and performance metrics used for post-launch item analysis.

Add an item-analysis review after sufficient exposure: difficulty index, distractor selection, discrimination signal, report rate, and cohort drift. Never automatically retire an item solely from early noisy data.

### Refine success metrics

Add definitions and guardrails:

- Activation: completes a sample rationale and first five-question test within 24 hours.
- Conversion: paid within 30 days of registration, reported by acquisition cohort.
- Retention: eligible free users who return and answer a question on day 7 (state the window).
- Learning: domain accuracy improvement on unseen items, not repeated-item score inflation.
- Content health: report rate per exposure, not “percent of items flagged.”
- Reliability: p95 API latency and page Core Web Vitals separately; include availability and grading error rate.
- Revenue: checkout completion, refund/dispute rate, renewal rate, and net revenue by cohort.

The 90-day traffic, conversion, and SEO targets should be labeled hypotheses until baseline audience size, search volume, and acquisition budget are documented.

## Proposed v1 acceptance criteria

### Public sample

- Works without authentication and is accessible by keyboard and screen reader.
- Does not expose the answer/rationale before submission in page data or client bundles.
- Shows right-answer reasoning and every distractor rationale after a valid submission.
- Displays the unaffiliated/no-real-exam-content disclaimer and a single sign-up CTA.

### Free daily test

- An authenticated free user can atomically start at most one daily test in the defined timezone.
- The first test may occur before email verification; subsequent test starts require verification.
- Refresh/resume preserves ordering and answers without double-grading.
- Results show all rationales; paid analytics are clearly previewed without misleading data.

### Paid test and simulator

- Active entitlement is checked server-side at creation and sensitive actions.
- Blueprint-weighted sessions match the versioned allocation exactly.
- The timer uses a server deadline, persists across devices, and finalizes expired sessions without a client request.
- Flags, unanswered questions, answer changes, and final submission follow a documented state machine.

### Billing and account lifecycle

- Signed, idempotent Stripe events support purchase, renewal, cancellation, failure, refund, and dispute flows.
- Checkout success is not treated as proof of entitlement without server verification.
- Users can restore a valid purchase when webhook delivery is delayed.
- Deletion behavior, retention exceptions, backups, and recovery are explained before confirmation and tested.

## Revised delivery approach

An eight-week calendar is possible only if product engineering and question production run as separately staffed workstreams. A safer set of gates is:

1. **Discovery and evidence:** decisions above, authoritative blueprint archive, legal review, pricing catalog, event dictionary, data inventory.
2. **Foundation:** repository protections, supported framework versions, CI, migrations, RLS tests, design tokens, accessibility baseline, preview environments.
3. **Vertical slice:** sample, auth, atomic daily session, server grading, rationale, results, minimum reviewed bank.
4. **Beta gate:** 10–15 observed users; measure sample-to-test completion and content trust; fix comprehension and reliability issues.
5. **Paid core:** subscription lifecycle, checkout/portal, entitlement recovery, support tooling.
6. **Simulator and analytics:** resumable state machine, expiry worker, heatmap, statistically qualified mold insights.
7. **Launch readiness:** 150 approved items (if resourced), load/security/accessibility testing, restore drill, legal pages, support/on-call and incident runbooks, launch content.

Use exit criteria rather than week numbers. In particular, content readiness should be “approved items by domain and difficulty,” not drafts produced.

## Repository creation requirements

No new GitHub repository should be created until the owner supplies the GitHub owner and repository name. Creation also requires an authenticated GitHub CLI/API identity with permission to that owner. The working directory used for this review is an existing profile repository with prior history, no configured remote, and no authenticated GitHub CLI, so repurposing or publishing it as CCArchPrep would be unsafe.

When access and decisions are supplied, create a **private** repository by default with:

- `main` as the protected default branch and pull-request-only changes;
- required CI checks, secret scanning, dependency updates, code-owner review for bank/migrations/security-sensitive paths;
- issue and pull-request templates, decision records, threat model, contribution/security policies;
- separate preview/staging/production projects and least-privilege vendor access;
- no production question bank in public history unless public distribution is an explicit business decision.

## Inputs needed before build work

- Canonical exam guide and evidence for any permitted third-party brand assets.
- Domain ownership evidence, legal reviewer, launch countries, and policies. The working brand is CCArchPrep.
- Refund/tax decisions and Stripe account owner. The working v1 price is $59/year.
- Two named human approvals for the 10 structural samples in `bank/sample-questions.json`, plus actual ebook chapter/stage links to replace the blocked rows in `bank/ebook-remap.csv`.
- GitHub owner, repository name, and an authenticated repo-creation path. Private visibility is confirmed.
- Organization-owned Supabase, Vercel, Stripe, domain/DNS, transactional email, monitoring, and optional analytics accounts.
- Named team, weekly availability, beta-list consent status, and support owner. “ASAP” is the schedule intent; the launch date will be forecast after staffing and readiness are known.

## Verification note

The architecture and consistency findings above are based on the supplied PRD and repository inspection. Authoritative web verification of the exam, current vendor/framework guidance, domain availability, and trademark facts remains mandatory; the review environment's web-search service returned an authorization error, so those time-sensitive claims are intentionally not represented here as verified facts.
