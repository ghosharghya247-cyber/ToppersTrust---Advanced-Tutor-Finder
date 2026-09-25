// Run against npm run dev. All account/data requests are intercepted; no live writes.
// npm install --prefix /tmp/tt-ui-tests playwright
// PLAYWRIGHT_MODULE_PATH=/tmp/tt-ui-tests/node_modules/playwright node tests/ui-smoke.cjs
const assert = require("node:assert/strict");
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE_PATH || "playwright",
);
const base = process.env.UI_BASE_URL || "http://127.0.0.1:5173";
const userId = "11111111-1111-4111-8111-111111111111";
const person = {
  id: 7,
  user_id: userId,
  name: "Samira Rahman",
  email: "ui-test@example.invalid",
  phone: "01700000000",
  gender: "Female",
  city: "Dhaka",
  address: "Dhanmondi",
  relation_with_student: "Mother",
  verified_yn: true,
  photo: null,
  preferred_subjects: "Mathematics,Physics",
  preferred_classes: "Class 8,Class 9",
  preferred_areas: "Dhanmondi",
  tutoring_style: "Patient,Interactive",
  tutoring_method: "Home Tutoring",
  available_time: "4 PM – 7 PM",
  experience_years: 3,
  uni: "University of Dhaka",
  uni_grade: 3.8,
  uni_exam_degree: "BSc",
  uni_major_group: "Mathematics",
  uni_currently_studying: true,
  ssc_school: "Dhaka School",
  ssc_grade: 5,
  hsc_school: "Dhaka College",
  hsc_grade: 5,
  expected_salary: 6000,
};
const tutors = Array.from({ length: 8 }, (_, i) => ({
  ...person,
  id: 21 + i,
  name: [
    "Nadia Akter",
    "Rafi Ahmed",
    "Maliha Chowdhury",
    "Tanvir Hasan",
    "Ayesha Karim",
    "Sadia Islam",
    "Anika Rahman",
    "Imran Ali",
  ][i],
  qualification: "Mathematics",
  rating: 4 + i / 10,
  city: i % 2 ? "Chattogram" : "Dhaka",
  preferred_areas: i % 2 ? "Chattogram" : "Dhanmondi",
}));
const jobs = [
  {
    id: 51,
    code: "TT-051",
    guardianid: 7,
    subjects: "Mathematics,Physics",
    medium: "English Version",
    class: "Class 8",
    area: "Dhanmondi",
    salary: 6000,
    paymentbasis: "M",
    posted_date: "2026-09-20",
    daysperweek: 3,
    numberofstudents: 1,
    time: "5 PM – 7 PM",
    studentgender: "Female",
    genderpreference: "Female",
    tuition_type: "Home Tutoring",
    apply_job: [{ count: 2 }],
    accepted_jobs: [],
  },
];
const writes = [];
const runtimeErrors = [];
let failureTable = "";
let role = "guardian";
const user = () => ({
  id: userId,
  email: person.email,
  role: "authenticated",
  aud: "authenticated",
  created_at: "2026-01-01T00:00:00Z",
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: { user_role: role, full_name: person.name },
});
const token = () =>
  [
    Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
      "base64url",
    ),
    Buffer.from(
      JSON.stringify({
        sub: userId,
        aud: "authenticated",
        role: "authenticated",
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    ).toString("base64url"),
    "fixture-signature",
  ].join(".");
async function mock(route) {
  const url = new URL(route.request().url());
  if (url.origin === new URL(base).origin) return route.continue();
  if (url.pathname.startsWith("/auth/v1/")) {
    if (url.pathname.endsWith("/token"))
      return route.fulfill({
        json: {
          access_token: token(),
          refresh_token: "fixture-refresh",
          token_type: "bearer",
          expires_in: 3600,
          user: user(),
        },
      });
    if (url.pathname.endsWith("/user")) return route.fulfill({ json: user() });
    return route.fulfill({ status: 204, body: "" });
  }
  if (!url.pathname.startsWith("/rest/v1/")) return route.abort();
  const table = url.pathname.split("/").pop();
  const method = route.request().method();
  if (!["GET", "HEAD"].includes(method)) {
    writes.push({ table, method, body: route.request().postDataJSON() });
    if (failureTable === table)
      return route.fulfill({
        status: 400,
        json: {
          message: "Test save failed. Please retry.",
          code: "TEST_ERROR",
        },
      });
    if (table === "media_to_admin")
      return route.fulfill({
        json: {
          id: 99,
          created_at: "2026-09-25T10:00:00Z",
          job_description: route.request().postDataJSON()[0].job_description,
        },
      });
    return route.fulfill({ status: 201, json: [] });
  }
  let data;
  if (["guardian", "media", "tutor"].includes(table)) data = [person];
  else if (table === "tutor_card") data = tutors;
  else if (table === "recommendedtutors")
    data = tutors.map((t, i) => ({ id: i + 1, id2: t.id }));
  else if (table === "job") data = jobs;
  else if (table === "apply_job")
    data = url.searchParams.has("job_id")
      ? [{ tutor_id: 21 }, { tutor_id: 22 }]
      : [];
  else if (table === "media_to_admin")
    data = [
      {
        id: 80,
        created_at: "2026-09-20T10:00:00Z",
        job_description:
          "Class 8 Mathematics in Dhanmondi, three evenings each week.",
      },
    ];
  else data = [];
  const single = (route.request().headers().accept || "").includes(
    "vnd.pgrst.object",
  );
  return route.fulfill({ json: single ? data[0] || null : data });
}
async function authenticate(page, as) {
  role = as;
  await page.goto(base);
  await page.evaluate(async () => {
    const { supabase } = await import("/src/supabase.js");
    const { error } = await supabase.auth.signInWithPassword({
      email: "ui-test@example.invalid",
      password: "fixture-only-password",
    });
    if (error) throw error;
  });
}
async function goto(page, path, title) {
  await page.goto(base + path);
  await page.getByRole("heading", { name: title, exact: true }).waitFor();
  await page
    .locator(".loading-state")
    .waitFor({ state: "hidden" })
    .catch(() => {});
}
async function noOverflow(page, path) {
  const sizes = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    width: innerWidth,
  }));
  assert.ok(
    sizes.scroll <= sizes.width + 1,
    path + " overflows: " + JSON.stringify(sizes),
  );
}
async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox"],
  });
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    await context.route("**/*", mock);
    const page = await context.newPage();
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    await authenticate(page, "guardian");
    await goto(page, "/browse-tutors", "Find your next guide.");
    assert.equal(
      await page.locator(".educator-grid .educator-card").count(),
      6,
    );
    await page.getByRole("button", { name: "Next", exact: true }).click();
    assert.equal(
      await page.locator(".educator-grid .educator-card").count(),
      2,
    );
    await page.getByRole("button", { name: "Previous", exact: true }).click();
    await page.getByLabel("Find an educator").fill("Nadia");
    assert.equal(
      await page.locator(".educator-grid .educator-card").count(),
      1,
    );
    await page.locator(".educator-more summary").click();
    assert.ok(await page.locator(".educator-more").evaluate((e) => e.open));
    await page.getByRole("button", { name: "I’m interested" }).click();
    await page.getByRole("dialog").waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog[open]").count(), 0);
    await page.getByRole("button", { name: "I’m interested" }).click();
    failureTable = "recc_tutors_accepted";
    await page.getByRole("button", { name: "Yes, select tutor" }).click();
    await page.getByRole("dialog").getByRole("alert").waitFor();
    assert.equal(await page.locator("dialog[open]").count(), 1);
    failureTable = "";
    await page.getByRole("button", { name: "Yes, select tutor" }).click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.ok(
      writes.some(
        (w) => w.table === "recc_tutors_accepted" && w.body.tutor_id === 21,
      ),
    );
    await page.getByLabel("Find an educator").fill("");
    await page.screenshot({ path: "/tmp/tt-discovery-desktop.png" });
    await goto(page, "/guardian/post-job", "Post a tuition.");
    await page.locator("#subjectToAdd").selectOption({ index: 1 });
    const subject = await page
      .locator("#subjectToAdd option:checked")
      .textContent();
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await page.getByRole("button", { name: "Remove " + subject }).waitFor();
    await page.getByRole("button", { name: "Remove " + subject }).click();
    assert.equal(await page.locator(".subject-chip").count(), 0);
    await page.getByLabel("Street address").fill("House 10, Road 2");
    assert.equal(
      await page.getByLabel("Street address").inputValue(),
      "House 10, Road 2",
    );
    await page.getByLabel("Preferred start date").fill("2026-10-01");
    assert.equal(
      await page.getByLabel("Preferred start date").inputValue(),
      "2026-10-01",
    );
    await page.screenshot({ path: "/tmp/tt-form-desktop.png" });
    await goto(page, "/guardian/shortlisted", "Your tutor shortlist.");
    await page.getByRole("button", { name: "Review applicants" }).click();
    await page.getByRole("button", { name: "Appoint tutor" }).first().waitFor();
    await page.getByRole("button", { name: "Appoint tutor" }).first().click();
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    assert.equal(writes.filter((w) => w.table === "accepted_jobs").length, 0);
    await page.getByRole("button", { name: "Appoint tutor" }).first().click();
    await page.getByRole("button", { name: "Confirm appointment" }).click();
    await page
      .getByRole("status")
      .filter({ hasText: "has been appointed" })
      .waitFor();
    assert.equal(writes.filter((w) => w.table === "accepted_jobs").length, 1);
    await goto(page, "/guardian/profile", "Your profile.");
    await page.screenshot({ path: "/tmp/tt-profile-desktop.png" });
    await page.getByText("Personal information", { exact: true }).click();
    assert.equal(
      await page
        .locator(".profile-section")
        .first()
        .evaluate((e) => e.open),
      false,
    );
    await goto(page, "/guardian/profile/edit", "Edit your guardian profile.");
    assert.ok(await page.getByLabel("Full Name").isVisible());
    await authenticate(page, "media");
    await goto(page, "/media/browse-tutors", "Meet your next educator.");
    await page.getByLabel("Location", { exact: true }).fill("Chattogram");
    assert.match(
      await page.locator(".filter-count").textContent(),
      /4 educators/,
    );
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    await page.screenshot({ path: "/tmp/tt-partner-discovery.png" });
    failureTable = "interested_tutors_media";
    await page
      .getByRole("button", { name: "Select tutor", exact: true })
      .click();
    await page
      .getByRole("alert")
      .filter({ hasText: "Test save failed" })
      .waitFor();
    failureTable = "";
    await page
      .getByRole("button", { name: "Select tutor", exact: true })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: "Tutor selected." })
      .waitFor();
    await goto(page, "/media/post-job", "Request a tutor.");
    assert.equal(
      await page
        .getByRole("button", { name: "Send tutor request" })
        .isDisabled(),
      true,
    );
    await page
      .getByLabel("What kind of tutor")
      .fill(
        "Class 8 mathematics, Dhanmondi, three days per week, budget BDT 6000.",
      );
    await page.getByRole("button", { name: "Send tutor request" }).click();
    await page
      .getByRole("status")
      .filter({ hasText: "submitted successfully" })
      .waitFor();
    assert.equal(await page.getByLabel("What kind of tutor").inputValue(), "");
    await page.locator(".history-item summary").first().click();
    assert.ok(
      await page
        .locator(".history-item")
        .first()
        .evaluate((e) => e.open),
    );
    await goto(page, "/media/profile", "Your partner profile.");
    await goto(page, "/media/profile/edit", "Edit your partner profile.");
    assert.equal(await page.getByLabel("How did you find us?").count(), 0);
    assert.equal(await page.getByLabel("Drive Link (Optional)").count(), 0);
    await authenticate(page, "teacher");
    await goto(page, "/job-card", "Find your next tuition.");
    await page.getByRole("button", { name: "Apply for tuition" }).waitFor();
    failureTable = "apply_job";
    await page.getByRole("button", { name: "Apply for tuition" }).click();
    await page
      .getByRole("alert")
      .filter({ hasText: "Test save failed" })
      .waitFor();
    assert.ok(
      await page.getByRole("button", { name: "Apply for tuition" }).isEnabled(),
    );
    failureTable = "";
    await page.screenshot({ path: "/tmp/tt-tuition-desktop.png" });
    await page.getByRole("button", { name: "Apply for tuition" }).click();
    await page
      .getByRole("status")
      .filter({ hasText: "Application submitted" })
      .waitFor();
    await goto(page, "/tutor/profile", "Your profile.");
    await page.getByText("Personal information", { exact: true }).click();
    assert.ok(await page.getByText("National ID", { exact: true }).isVisible());
    await goto(page, "/tutor/profile/edit", "Edit your teaching profile.");
    await page.getByRole("link", { name: "Education", exact: true }).click();
    assert.match(page.url(), /#education$/);
    const routes = [
      ["/browse-tutors", "Find your next guide.", "guardian"],
      ["/guardian/post-job", "Post a tuition.", "guardian"],
      ["/guardian/shortlisted", "Your tutor shortlist.", "guardian"],
      ["/guardian/previous-jobs", "Your tuition posts.", "guardian"],
      ["/guardian/profile", "Your profile.", "guardian"],
      ["/guardian/profile/edit", "Edit your guardian profile.", "guardian"],
      ["/media/browse-tutors", "Meet your next educator.", "media"],
      ["/media/post-job", "Request a tutor.", "media"],
      ["/media/profile", "Your partner profile.", "media"],
      ["/media/profile/edit", "Edit your partner profile.", "media"],
      ["/job-card", "Find your next tuition.", "teacher"],
      ["/tutor/profile", "Your profile.", "teacher"],
      ["/tutor/profile/edit", "Edit your teaching profile.", "teacher"],
    ];
    for (const width of [360, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [path, title, as] of routes) {
        if (role !== as) await authenticate(page, as);
        await goto(page, path, title);
        await noOverflow(page, path + " @ " + width);
        if (width === 390 && path === "/guardian/profile")
          await page.screenshot({
            path: "/tmp/tt-profile-mobile.png",
            fullPage: true,
          });
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("navigation", { name: "Mobile navigation" }).waitFor();
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#mobile-navigation").count(), 0);
    assert.equal(
      await page.locator("body").evaluate((e) => getComputedStyle(e).fontSize),
      "16px",
    );
    assert.deepEqual(runtimeErrors, []);
    console.log(
      "PASS: 13 routes at 4 viewport sizes; search, pagination, subject chips, date/address entry, profile sections, accessible dialogs, request submission, failed/successful selection, mobile navigation. All writes intercepted.",
    );
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
