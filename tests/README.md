# Workspace UI smoke tests

Start the application with `npm run dev`, then run:

```sh
npm install --prefix /tmp/tt-ui-tests playwright
PLAYWRIGHT_MODULE_PATH=/tmp/tt-ui-tests/node_modules/playwright node tests/ui-smoke.cjs
```

The runner uses `/usr/bin/google-chrome`. Override `CHROME_PATH` or `UI_BASE_URL` if needed.

All external HTTP requests are intercepted. Authentication, profiles, tutors, jobs, and writes use test fixtures: these checks do not modify live accounts or database records. They cover responsive layouts, search, pagination, subject controls, profile sections, dialogs, form entry, and successful/failed submissions. Screenshots are written under `/tmp/tt-*.png`.

These are UI regression checks, not verification of live Supabase policies, delivery, or payment processing.

The education marketplace redesign expands this suite with subject-and-location
homepage search, URL handoff, login validation and password visibility, all five
discovery filters, price sorting, responsive filter expansion, and screenshot
coverage. The 13 existing workspace routes are checked at 360, 390, 768, and
1440px. The homepage and four authentication routes are also checked at 1536px.
Google Fonts assets may load externally; authentication and database requests
remain intercepted. No live account or database writes are made.
