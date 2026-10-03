# ToppersTrust — UI & Frontend Documentation

A detailed reference for the visual design system, theme, layout patterns, and page-by-page UI structure.

---

## Design Philosophy

The UI follows a **warm editorial aesthetic** — inspired by printed educational materials and notebooks. It avoids the cold, corporate feel of typical SaaS dashboards. The tone is human, encouraging, and calm.

Key principles:
- Typography-first: serif headings paired with a clean sans-serif body
- Warm neutral palette with earthy accent colors
- Generous whitespace and soft borders instead of heavy shadows
- Copywriting is part of the UI — every label, heading, and button uses thoughtful, human language (e.g. *"Let's get learning"*, *"A fresh page awaits"*)

---

## Theme & Design Tokens

Defined as CSS custom properties in `global.css`:

| Token | Value | Usage |
|---|---|---|
| `--ink` | `#243e35` | Primary text color (dark forest green) |
| `--forest` | `#234e3f` | Brand color — buttons, active states, links |
| `--sage` | `#e8eee4` | Light green tint — backgrounds, hover states |
| `--paper` | `#f8f7f2` | Page background (warm off-white) |
| `--muted` | `#68756e` | Secondary/helper text |
| `--line` | `#dfe4db` | Borders and dividers |
| `--terra` | `#a95135` | Accent/highlight color (terracotta) — used for italic headings, errors, CTAs |
| `--serif` | `"Lora", Georgia, serif` | Display/heading font |

### Typography

- **Body font**: `DM Sans` — clean, modern sans-serif at 16px / 1.6 line-height
- **Display font**: `Lora` (serif) — used for all major headings (`h1`, `h2` in hero, dashboards, profiles)
- **Eyebrow labels**: 12px, 650 weight, 1.8px letter-spacing, uppercase, `--forest` color
- **Heading style**: `letter-spacing: -0.035em` for tight, editorial feel

### Color Tones (Icon Tiles & Cards)

Three named tones used across action cards and icon tiles:

| Tone | Background | Text/Icon |
|---|---|---|
| `sage` | `#edf2e6` | `--forest` |
| `sand` | `#f8efde` | `#937441` (amber) |
| `terra` | `#f7e9df` | `--terra` (terracotta) |

---

## Layout System

### Shell Structure

```
<body>
  .site-shell                  ← full-height flex column
    .site-header               ← sticky top nav, 92px tall
    .site-content              ← flex: 1, main content area
      [page content]
    .site-footer               ← bottom bar with border-top
```

### Header (`.site-header`)

- Height: 92px, sticky, `z-index: 60`
- Background: `rgba(248, 247, 242, 0.97)` — slightly transparent paper
- Contains: brand logo, desktop nav links, header action buttons
- On mobile (< 900px): desktop nav hides, hamburger toggle appears
- Brand mark: dark forest green rounded square with a graduation cap icon

### Workspace Layout (Authenticated Pages)

Pages for logged-in users (Guardian, Tutor, Media) use a **sidebar + content** layout:

```
.has-workspace
  .workspace-sidebar           ← fixed left sidebar, 236px wide, top: 92px
    sidebar label
    nav links (with active state)
    .sidebar-note              ← tip/info card
    .sidebar-member            ← user avatar + name at bottom
  .workspace-content           ← margin-left: 236px, padding: 40px
    .page-container            ← max-width: 1140px, centered
```

The sidebar is hidden on mobile (< 900px) and the content takes full width.

### Page Container

`.page-container` — `max-width: 1140px`, `margin: 0 auto`. Used inside workspace content for all dashboard pages.

---

## Component Library

All reusable primitives live in `src/components/ui/Primitives.jsx`.

### `PageHeading`
Top of every dashboard page. Contains:
- Eyebrow label (small uppercase text)
- `h1` in serif font
- Description paragraph in muted color
- Right-aligned action slot (buttons, notifications)

### `Avatar`
Circular profile image with initials fallback.
- Sizes: default (38px), `large` (67px), `xlarge` (100px)
- Background: `#e3eacb` with forest green initials

### `ActionCard`
Clickable card linking to a section. Used in 3-column grids on dashboards.
- Icon tile (sage/sand/terra tone)
- Title + description
- Arrow icon top-right
- Hover: lifts 4px, border darkens

### `Notice`
Inline alert component.
- Default (success): green background `#edf4e7`, green border
- Error variant: warm red background `#fdf0e9`, terracotta border

### `LoadingState`
Centered spinner with label. Min-height 300px. Uses a spinning `Loader` icon inside a sage-tinted rounded square.

### `EmptyState`
Centered empty content block with icon, title, description, and optional action button.

### `Notifications`
Bell icon button with unread count badge (terracotta). Opens a dropdown panel (350px wide, max 420px tall) listing notification items.

### `RolePicker`
3-column grid of role selection cards (Guardian / Teacher / Media). Selected state: forest green border + light green background with a checkmark.

### `PasswordField`
Input with show/hide toggle button on the right side.

---

## Pages

### Landing Page (`/`)

**Layout**: Two-column hero grid (`1.15fr 1fr`) on a max-width 1440px container.

**Left column — Hero Copy:**
- Eyebrow with animated status dot
- Large serif `h1` with italic terracotta accent word (*"world"*)
- Description paragraph
- Two CTAs: primary button "Find your tutor" + text link "I want to teach"
- Reassurance row with checkmarks
- Decorative `LearningArtwork` — an illustrated composition of a tilted notebook card, two stacked book spines, a floating badge, and sparkle symbols

**Right column — Login Card:**
- White card with a terracotta top accent bar
- Serif `h2` heading
- `RolePicker` (Guardian / Teacher / Media)
- Email + password fields
- "Forgot password?" link
- Sign-in button
- Sign-up link at bottom

**Below the hero:**

1. **Subject Strip** — horizontal scrolling row of subject links (Mathematics, Science, English, Bangla, And beyond) with serif symbols (∑, ⚛, Aa, অ, ↗)

2. **How It Works Section** — 3-column step cards:
   - 01 Find your fit
   - 02 Make a connection
   - 03 Grow together

3. **Join Banner** — full-width dark forest green banner with serif heading and a CTA button. Has a large decorative `✳` watermark.

4. **FAQ Section** — 2-column grid. Left: heading. Right: `<details>` accordion items.

---

### Sign Up (`/sign-up-frame`)

**Layout**: `AuthLayout` — 2-column split (`0.8fr 1.2fr`).

**Left aside** (`.auth-aside`):
- Eyebrow + serif heading + description
- `LearningArtwork` illustration
- Footnote at bottom

**Right form side** (`.auth-form-side`):
- `RolePicker` at top
- 2-column `form-grid` with fields: Name, Email, Phone, City, Area, Gender
- Password + Confirm Password fields
- Terms checkbox
- Submit button: "Create my account"

On mobile (< 680px): left aside is hidden, form takes full width.

---

### Guardian Dashboard (`/guardian`)

**Structure:**
```
PageHeading (eyebrow + serif h1 + logout button)
Notice (error)
dashboard-welcome section
  Avatar (large) + name + description
  "Post a tuition" primary button
action-grid (3 columns)
  ActionCard: Find your tutor (sage)
  ActionCard: Your shortlist (sand)
  ActionCard: Manage tuition posts (terra)
dashboard-columns (1.7fr 1fr)
  Left panel: Recommended tutors list
    tutor-list-row items (avatar + name + arrow link)
  Right aside:
    tip-panel: "A clearer brief. A better connection."
    quick-list: profile links
```

---

### Tutor Dashboard (`/tutor`)

**Structure:**
```
PageHeading (eyebrow + serif h1 + notifications bell + logout button)
Notice (error)
dashboard-welcome section
  Avatar (large) + name + description
  "Explore tuitions" primary button
action-grid (3 columns)
  ActionCard: Find a tuition (sage)
  ActionCard: Your teaching profile (sand)
  ActionCard: Payments & dues (terra)
dashboard-columns (1.7fr 1fr)
  Left panel: Latest updates (accepted job notifications)
    tutor-list-row items (sage icon tile + message + date)
  Right aside:
    tip-panel: "Promote my profile" with ৳200 payment button
    quick-list: profile edit link
```

---

### Media Dashboard (`/media`)

**Structure:**
```
PageHeading (eyebrow + serif h1 + notifications bell + logout button)
Notice (error)
dashboard-welcome section
  Avatar (large) + name + description
  "Request a tutor" primary button
action-grid (3 columns)
  ActionCard: Explore educators (sage)
  ActionCard: Request a tutor (sand)
  ActionCard: Your partner profile (terra)
dashboard-columns (1.7fr 1fr)
  Left panel: Admin recommendations list
    request-card items (tutor name + job description + admin note + select button)
  Right aside:
    tip-panel: "Great matches begin with clear details."
```

---

### Post Job (`/guardian/post-job`)

**Layout**: `form-layout` — `2.2fr 1fr` grid (form + sticky guidance sidebar).

**Form is split into 3 numbered sections (panels):**

**01 · The Learner**
- Number of students (select)
- Medium (select)
- Class/course (select)
- Student gender (segmented control: Male / Female)
- Subjects (multi-select with chip tags, up to 5)

**02 · The Setting**
- City (select)
- Area/location (select, filtered by city)
- Street address (text input)
- Tuition type (select)
- Tutor gender preference (segmented control: Male / Female / Any)

**03 · The Details**
- Days per week (select)
- Preferred time (text)
- Start date (date picker)
- Budget in BDT (number)
- Payment basis (select)
- Additional details (textarea, 500 char limit with counter)
- Cancel + "Publish tuition" buttons

**Right sidebar (sticky):**
- Tip panel: "Small details. Stronger connections."
- Guidance checklist
- Live draft summary showing selected class, subjects, and city

---

### Job Card / Tuition Discovery (`/job-card`)

**Layout**: `discovery-layout` — `1.65fr 1fr` grid.

**Left — Swipe Queue:**
- `SearchFilters` bar (location + gender filter + count)
- Queue stack: stacked `TinderCard` components (swipeable left/right)
- Each card (`tuition-card`) shows:
  - Badge with tuition type
  - Sage icon tile with book icon
  - Serif `h2` title
  - Location with pin icon
  - Subject chips
  - Salary block (green tinted, large number)
  - `InfoGrid` with class, medium, days, time, students, gender, posted date
- `QueueActions`: two buttons — Skip (left) / Apply for tuition (right)
- Hint text: "Use the buttons, or swipe left to skip and right to apply."

**Right — Tip Panel (sticky):**
- "The right match goes both ways."
- Guidance checklist

**Modal**: Login prompt dialog when unauthenticated user tries to apply.

---

### Tutor Profile (`/tutor/profile`)

**Layout**: `profile-layout` — `290px 1fr` grid.

**Left — Profile Summary (sticky):**
- `xlarge` Avatar (100px)
- Eyebrow role label
- Serif name heading
- Profile completion progress bar (green fill)
- Contact info (email, phone, location)
- Privacy note
- Edit profile button

**Right — Profile Details:**
Collapsible `<details>` sections (`.profile-section`):

1. **Teaching preferences** — InfoGrid with tutoring method, experience, availability, salary, preferred locations/classes/subjects, tutoring style
2. **Education** — University entry (curriculum, degree, major, result, dates), HSC entry, SSC entry
3. **Personal information** (collapsed by default) — full contact details, family info, national ID, Facebook/Drive links

---

### Guardian Profile (`/guardian/profile`)

Same `profile-layout` as tutor profile. Sections:
1. Contact & location details
2. Relation with student
3. Verification status card

---

### Admin Portal (`/admin`)

**Completely different visual theme** — dark terminal/hacker aesthetic:

- Background: `#0a0a0c` (near-black)
- Text: `slate-300`
- Accent: `#00FF41` (matrix green)
- Font: `font-mono`
- Selection highlight: `#00FF41` text on black background

**Header:**
- Left-border accent in matrix green
- "SYSTEM_ROOT_ACCESS: LEVEL_0" eyebrow with pulsing shield icon
- Operator name in large white + matrix green text
- UUID badge + protocol version

**Navigation:**
Horizontal scrollable tab bar. Active tab: black text on matrix green background. Inactive: colored text on dark background.

| Tab | Color |
|---|---|
| Dashboard | emerald |
| Media Jobs | blue |
| Media Interests | pink |
| Accepted Tutors | purple |
| Complaints | red |
| Dues | yellow |
| Logs | cyan |

**Dashboard view:** Grid of clickable node cards, each with a colored icon.

**Data tables:** Dark background (`#0c0c0e`), slate borders, colored row highlights per section type.

**Transmit form** (send tutor to media): Matrix green bordered panel with black inputs and a full-width "INITIATE_DATA_TRANSFER" button.

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| `> 1500px` | Header uses calculated padding for ultra-wide screens |
| `≤ 1100px` | Sidebar narrows to 205px, form guidance unsticks, auth aside shrinks |
| `≤ 900px` | Desktop nav hidden → hamburger menu; sidebar hidden → full-width content; auth layout adjusts |
| `≤ 680px` | Single-column everything: hero, form grid, action grid, dashboard columns, profile layout |
| `≤ 380px` | Header action buttons hidden; info grid goes single column |

---

## Accessibility

- All interactive elements have `focus-visible` outlines (3px terracotta, 4px offset)
- Skip-to-content link (`.skip-link`) appears on focus
- `aria-invalid` on form inputs with errors
- `aria-label` on icon-only buttons
- `aria-pressed` on segmented control buttons
- `aria-hidden` on non-current swipe cards in the queue
- `prefers-reduced-motion` media query disables all animations and transitions
- Semantic HTML: `<article>`, `<aside>`, `<section>`, `<nav>`, `<header>`, `<details>`/`<summary>` for accordions
