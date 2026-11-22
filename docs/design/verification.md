# Education marketplace verification

## Browser and checks

The built-in browser host returned “The browser access host is unavailable.”
Verification used real Google Chrome through Playwright, with the repository's
existing regression suite expanded for the new discovery controls.

- Production build: `npm run build`.
- Lint: `npm run lint`.
- Patch whitespace: `git diff --check`.
- Browser: `UI_BASE_URL=http://127.0.0.1:5174 PLAYWRIGHT_MODULE_PATH=/tmp/tt-ui-tests/node_modules/playwright node tests/ui-smoke.cjs`.
- Workspace routes: 13 at widths 360, 390, 768, 1440px.
- Homepage and four authentication routes: widths 360, 390, 768, 1440, 1536px.
- Native concept viewport: 1536 × 1024px; desktop discovery additionally captured at that size. Mobile: 390 × 844px.
- Functional paths: homepage search and URL parameters, login validation and successful role routing, password visibility, five combined discovery filters, sorting, pagination, expandable teaching details, accessible interest dialogs, failed and successful interest writes, tuition subject editing, address/date entry, applicant appointment, partner tutor selection, partner requests, profile sections and editors, tuition applications, payment-return cancellation notice, mobile navigation and Escape dismissal.
- All authentication/data calls and writes use fixtures. Google Fonts and local assets may load normally. Live Supabase authorization policies, delivery, and financial processing were not exercised by these UI checks.

## Visual comparison ledger

Selected references: `home-concept.png`, `discovery-concept.png`, `lower-page-concept.png`.
Screenshots were captured by Playwright and inspected with `view_image`, including
the concepts and latest browser screenshots in the same review pass.

| Comparison | Reference | Render and resolution |
| --- | --- | --- |
| First viewport | Left serif headline and search beside one learning photograph | Same composition and hierarchy; constrained to a readable page width. Photograph independently generated for the production asset. |
| Palette | Mulberry, rose, eucalyptus, honey, warm white | Shared CSS variables, MUI theme, legacy Tailwind font settings, and avatar fallback colors aligned to the education identity. No gradient decoration. |
| Typography | Fraunces headings and Manrope controls | Real web fonts loaded. Small profile metadata was enlarged after mobile screenshot review; mobile form fields use 16px where practical. |
| Photography | Tutor in olive shirt and learner in blue at a sunlit table | Optimized 216KB WebP, responsive cover crop, no tint overlay. Faces, notebook, and human interaction remain visible on phones. |
| Discovery structure | Quiet filter rail and horizontal profile rows | Preserved. Existing signed-in workspace sidebar remains. Filter rail expands on request on mobile. |
| Profile information | Name, education, subjects, area, rating, price, schedule, details, action | All driven by existing tutor data. Missing portraits show initials; unknown ratings and availability are explicitly identified. No invented verification claims or tutor photography. |
| Lower-page rhythm | Open three-step sequence, mulberry invitation, FAQ | Preserved. Two joined phrases caused by hidden mobile line breaks were corrected. FAQ and search remain native interactive controls. |
| Responsiveness | Same identity adapted to narrow screens | Stacked hero, two-column subject index, collapsible filters, stacked booking information, 44px mobile primary actions, no horizontal overflow in tested routes. |
| Focus and motion | Visible interaction states and restrained motion | Dark mulberry keyboard focus rings, Escape dismissal, reduced motion supported. |

## Copy comparison and intentional adaptations

The above-the-fold copy was compared with the concept. The main headline,
introductory description, navigation, search action, popular subjects,
photographic note, and reassurance band retain the proposed meaning and order.
Intentional adaptations: the logo subtitle reads “A good place to grow”; functional
form fields show “All subjects” and “City or area”; signed-in users see the existing
Workspace action; the search button uses the primary mulberry action color.
Subject descriptions were shortened for mobile reading, and code-native subject
symbols replace the mockup's book/microscope props. The existing account gates,
workspace navigation, and selection dialogs remain authoritative.

The implementation was visually verified against the selected design direction
across layout, typography, color, imagery, copy, spacing, and responsive behavior.
No unresolved clipping, broken controls, or horizontal overflow remained in the
tested surfaces. The noted data and authentication adaptations are intentional.

## Final result

Build, lint, whitespace checks, and the complete browser suite passed. The final
browser run completed after the production build, avoiding development hot reload
during screenshot capture. Captures retained here: `home-desktop.png`,
`home-mobile.png`, `discovery-desktop.png`, and `discovery-mobile.png`.
