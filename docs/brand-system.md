# CCArchPrep brand system

## Brand foundation

**Name:** CCArchPrep  
**Descriptor:** The unofficial CCAR-P practice platform  
**Position:** Scenario-led preparation that teaches architectural judgment rather than recalled exam content.  
**Required disclaimer:** “CCArchPrep is independent and is not affiliated with or endorsed by Anthropic. Claude and Anthropic are trademarks of their respective owner.”

The visual system is deliberately **warm, editorial, and technical**. It may feel compatible beside Anthropic product screenshots, but it must not reproduce Anthropic's logo, proprietary type, exact marketing layouts, or imply an official relationship.

## Logo concept

The mark combines two nested `C` forms with an ascending architectural stair. It suggests structured preparation, progression, and an architect's plan without using Claude's spark/asterisk identity. The master assets are:

- `public/brand/ccarchprep-mark.svg` — square icon and favicon source.
- `public/brand/ccarchprep-logo.svg` — horizontal brand lockup.
- `public/brand/ccarchprep-social-card.svg` — editable 1200 × 630 social/launch graphic.

SVG is the master format because a logo must remain sharp, accessible, editable, and reproducible at every size. Export PNG and WebP derivatives during the application build rather than treating generated raster lettering as the source of truth.

### Logo rules

- Keep clear space equal to one stair width around the mark.
- Minimum mark size: 24 px digital; minimum lockup width: 144 px.
- Use the ink version on cream/sand and the cream version on ink/coral.
- Do not rotate, add shadows, recolor individual stair steps, or combine it with Anthropic's logo.
- The wordmark must always spell `CCArchPrep` exactly.

## Color

| Token | Hex | Intended use |
|---|---:|---|
| Ink 900 | `#181714` | Primary text, dark surfaces |
| Ink 700 | `#3B3933` | Secondary text |
| Paper 50 | `#F7F3EA` | Page background |
| Paper 100 | `#EEE8DB` | Muted panels |
| Coral 600 | `#C85B3C` | Primary action and active state |
| Coral 700 | `#A9452D` | Hover/pressed action |
| Ochre 500 | `#C7973E` | Highlights and progress |
| Sage 600 | `#567162` | Correct/success state |
| Rose 700 | `#9B3A42` | Incorrect/error state |
| White | `#FFFFFF` | Text on dark/action surfaces |

Coral is a brand accent, not a substitute for semantic status. Never encode correct/incorrect or difficulty by color alone. Text must meet WCAG 2.2 AA contrast: 4.5:1 for normal text and 3:1 for large text and meaningful UI boundaries.

## Typography

- **Display:** `Newsreader`, variable serif, used for marketing headlines and score moments.
- **UI/body:** `Inter`, variable sans serif, used for controls, questions, rationales, and dashboards.
- **Fallbacks:** display `Georgia, serif`; UI `system-ui, -apple-system, "Segoe UI", sans-serif`.
- Self-host production fonts where licensing permits; subset weights to reduce layout shift and third-party requests.
- Body text is at least 16 px with a 1.5 line height. Question stems target 18–20 px and a maximum readable measure of 72 characters.

## Voice and messaging

CCArchPrep is calm, precise, candid, and encouraging. It sounds like a senior architect conducting a useful design review.

**Use:** “Here is the constraint that decides the answer.”  
**Avoid:** “You think wrong.”  
**Use:** “Original, blueprint-aligned scenarios.”  
**Avoid:** “Real exam questions” or any suggestion of leaked content.  
**Use:** measured evidence with denominators.  
**Avoid:** unsupported pass guarantees, false urgency, or unqualified cohort comparisons.

Suggested homepage copy:

- **Headline:** Think like an architect. Prepare with intent.
- **Subhead:** Original CCAR-P practice scenarios with rationales that explain the decision—and every tempting wrong turn.
- **CTA:** Try a sample question
- **Trust line:** Original scenarios · Every option explained · Independent and unofficial

## Photography and illustration direction

- Prefer editorial diagrams, abstract plan grids, layered decision paths, and quiet workspaces.
- Use warm paper, charcoal ink, coral highlights, subtle grain, and generous negative space.
- Avoid humanoid robots, glowing brains, generic circuit heads, exam-cheating imagery, Anthropic logos, certificates that look official, and dense faux-UI text.
- People, when used, should feel candid and globally representative rather than staged stock-photo teams.
- Product screenshots use real seeded data, visible focus states, and no personal information.

## Screenshot direction

1. **Sample rationale:** stem and options on the left; constraint callout and option-level rationale on the right.
2. **Domain heatmap:** seven clearly labeled domains, confidence/sample count visible, no red-green-only encoding.
3. **Mold insight:** show the numerator and denominator plus linked supporting attempts.
4. **Simulator review:** timer, answered/unanswered/flagged legend, keyboard-focus treatment, and explicit submit action.

Use 16:10 desktop frames for marketing, plus a 390 px mobile crop. Keep browser chrome minimal and never fabricate performance claims in screenshots.

## Accessibility expectations

- Target WCAG 2.2 AA from the first vertical slice.
- Complete every test flow by keyboard without traps; preserve a visible focus indicator.
- Use semantic `fieldset`/`legend` groups for answers and announce grading/rationale updates through an appropriate live region.
- Provide a non-animated mode; confetti respects `prefers-reduced-motion` and never blocks navigation.
- Timer warnings are visual and announced, but do not repeatedly interrupt assistive technology.
- Charts include tables or textual equivalents. Icons always have adjacent labels when meaning is not decorative.
- Validate at 200% zoom, 320 CSS px width, high contrast, and screen-reader browse/forms modes.

## Asset-generation note

The repository's deterministic vector masters were created locally. The requested raster image-generation service is not available in this environment; therefore no AI-generated photo or raster illustration is represented as complete. When that service is available, generate optional hero imagery from this brief, review it for trademark confusion and accessibility, and keep it subordinate to the vector identity.
