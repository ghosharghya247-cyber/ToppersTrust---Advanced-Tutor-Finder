import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  EmptyState,
  LoadingState,
  Notice,
} from "../../components/ui/Primitives";
import { Pagination, TutorPreview } from "../../components/ui/Discovery";
import Modal from "../../components/ui/Modal";

const values = (value) =>
  (Array.isArray(value) ? value : String(value || "").split(/[,;]+/))
    .map((s) => String(s).trim())
    .filter(Boolean);
const contains = (value, query) =>
  values(value).join(" ").toLowerCase().includes(query.toLowerCase());
const salary = (t) =>
  Number(
    String(t.expectedSalary ?? t.expected_salary ?? "").replace(/[^0-9.]/g, ""),
  );
export default function RecommendedTutorsView({
  tutors = [],
  loading,
  error,
  showLoginPrompt,
  handleLoginRedirect,
  onDismissLogin,
  showAcceptConfirmModal,
  tutorToConfirm,
  confirmAcceptTutor,
  cancelAcceptTutor,
  uiFeedbackMessage,
  isBrowsePage,
  onSelectTutor,
  selecting,
}) {
  const [params, setParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = params.get("q") || "";
  const subject = params.get("subject") || "";
  const location = params.get("location") || "";
  const budget = params.get("budget") || "";
  const availability = params.get("availability") || "";
  const gender = params.get("gender") || "";
  const sort = params.get("sort") || "default";
  const activeCount = [subject, location, budget, availability, gender].filter(
    Boolean,
  ).length;
  const change = (key, value) => {
    setPage(1);
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  };
  const reset = () => {
    setParams({});
    setPage(1);
  };
  const subjectOptions = [
    ...new Set([
      "Mathematics",
      "Physics",
      "Chemistry",
      "Science",
      "English",
      "Bangla",
      "Biology",
      "ICT",
      ...tutors.flatMap((t) => values(t.preferred_subjects)),
      ...(subject ? [subject] : []),
    ]),
  ].sort();
  const scheduleOptions = [
    ...new Set(
      tutors.flatMap((t) => values(t.availableTime || t.available_time)),
    ),
  ].sort();
  const matches = useMemo(() => {
    const list = tutors.filter((t) => {
      const searchable = [
        t.name,
        t.location,
        t.university,
        t.department,
        ...values(t.preferred_subjects),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        searchable.includes(query.trim().toLowerCase()) &&
        (!subject ||
          contains(t.preferred_subjects, subject) ||
          (subject === "Science" &&
            /physics|chemistry|biology|science/i.test(
              values(t.preferred_subjects).join(" "),
            ))) &&
        (!location.trim() ||
          contains(
            t.location || t.preferred_areas || t.city,
            location.trim(),
          )) &&
        (!budget || (salary(t) > 0 && salary(t) <= Number(budget))) &&
        (!availability ||
          contains(t.availableTime || t.available_time, availability)) &&
        (!gender ||
          String(t.gender || "").toLowerCase() === gender.toLowerCase())
      );
    });
    return sort === "name"
      ? list.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
      : sort === "rating"
        ? list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
        : sort === "price"
          ? list.sort(
              (a, b) => (salary(a) || Infinity) - (salary(b) || Infinity),
            )
          : list;
  }, [tutors, query, subject, location, budget, availability, gender, sort]);
  const pages = Math.max(1, Math.ceil(matches.length / 6));
  const safePage = Math.min(page, pages);
  const filtered = Boolean(query || activeCount);
  return (
    <div className="page-container tutor-discovery">
      <section className="discovery-intro">
        <div className="discovery-intro-top">
          <div>
            <h1>
              {isBrowsePage
                ? "Find your next guide."
                : "Tutors worth getting to know."}
            </h1>
            <p>
              Good teaching starts with the right connection. Find someone who
              fits your learner’s world.
            </p>
          </div>
          <Link
            className="button button-secondary button-small"
            to="/guardian/post-job"
          >
            <Plus size={16} />
            Post a tuition
          </Link>
        </div>
        <div className="field discovery-search">
          <label htmlFor="tutor-search">Find an educator</label>
          <div className="search-input">
            <Search size={20} />
            <input
              id="tutor-search"
              type="search"
              placeholder="Name, subject, university, or area…"
              value={query}
              onChange={(e) => change("q", e.target.value)}
            />
          </div>
        </div>
      </section>
      <div className="tutor-discovery-layout">
        <aside className="tutor-filter-rail">
          <button
            className="filter-mobile-trigger"
            aria-expanded={filtersOpen}
            aria-controls="tutor-filters"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <SlidersHorizontal size={18} />
            Refine your search{activeCount > 0 && <span>{activeCount}</span>}
            <ChevronDown size={18} />
          </button>
          <h2>Refine your search</h2>
          <div
            id="tutor-filters"
            className={filtersOpen ? "filter-fields is-open" : "filter-fields"}
          >
            <div className="field">
              <label htmlFor="filter-subject">Subject</label>
              <select
                id="filter-subject"
                value={subject}
                onChange={(e) => change("subject", e.target.value)}
              >
                <option value="">All subjects</option>
                {subjectOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="filter-location">Location</label>
              <input
                id="filter-location"
                type="search"
                placeholder="City or area"
                value={location}
                onChange={(e) => change("location", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="filter-budget">Monthly budget</label>
              <select
                id="filter-budget"
                value={budget}
                onChange={(e) => change("budget", e.target.value)}
              >
                <option value="">Any budget</option>
                {[3000, 5000, 8000, 12000, 20000].map((n) => (
                  <option key={n} value={n}>
                    Up to ৳{n.toLocaleString("en-BD")}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="filter-availability">Availability</label>
              <select
                id="filter-availability"
                value={availability}
                onChange={(e) => change("availability", e.target.value)}
              >
                <option value="">Any schedule</option>
                {[
                  ...new Set([
                    ...scheduleOptions,
                    ...(availability ? [availability] : []),
                  ]),
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="filter-gender">Tutor preference</label>
              <select
                id="filter-gender"
                value={gender}
                onChange={(e) => change("gender", e.target.value)}
              >
                <option value="">Any preference</option>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </div>
            <button className="clear-filters" onClick={reset}>
              Clear filters
            </button>
          </div>
        </aside>
        <section className="tutor-results" aria-label="Tutor results">
          <div className="results-toolbar">
            <p role="status">
              {loading ? (
                "Finding tutors…"
              ) : (
                <>
                  <strong>{matches.length}</strong>{" "}
                  {matches.length === 1 ? "tutor" : "tutors"}
                  {filtered ? " match your search" : " to get to know"}
                </>
              )}
            </p>
            <div className="sort-field">
              <label htmlFor="tutor-sort">Sort by</label>
              <select
                id="tutor-sort"
                value={sort}
                onChange={(e) => change("sort", e.target.value)}
              >
                <option value="default">Recommended order</option>
                <option value="name">Name: A to Z</option>
                <option value="rating">Highest rated</option>
                <option value="price">Lowest monthly price</option>
              </select>
            </div>
          </div>
          {filtered && (
            <div className="active-filters" aria-label="Active search filters">
              {[
                ["q", query],
                ["subject", subject],
                ["location", location],
                [
                  "budget",
                  budget
                    ? "Up to ৳" + Number(budget).toLocaleString("en-BD")
                    : "",
                ],
                ["availability", availability],
                ["gender", gender],
              ]
                .filter(([, value]) => value)
                .map(([key, value]) => (
                  <button
                    key={key}
                    aria-label={"Remove " + value + " filter"}
                    onClick={() => change(key, "")}
                  >
                    {value}
                    <X size={13} />
                  </button>
                ))}
            </div>
          )}
          <Notice error>{error}</Notice>
          <Notice error={uiFeedbackMessage?.type === "error"}>
            {uiFeedbackMessage?.text}
          </Notice>
          {loading ? (
            <LoadingState label="Getting to know your next educators…" />
          ) : matches.length ? (
            <>
              <div className="educator-grid">
                {matches.slice((safePage - 1) * 6, safePage * 6).map((t) => (
                  <TutorPreview key={t.id} tutor={t} compact>
                    <button
                      className="button button-primary button-full"
                      disabled={selecting}
                      onClick={() => onSelectTutor(t)}
                    >
                      I’m interested
                      <ArrowRight size={16} />
                    </button>
                  </TutorPreview>
                ))}
              </div>
              {pages > 1 && (
                <Pagination page={safePage} pages={pages} onChange={setPage} />
              )}
            </>
          ) : (
            <section className="discovery-empty">
              <EmptyState
                icon={Search}
                title={
                  filtered
                    ? "Let’s find another fit."
                    : "Your tutor search starts here"
                }
                description={
                  filtered
                    ? "Try a nearby area, a different subject, or a wider budget."
                    : "Sign in to explore available tutor profiles and find the right guidance."
                }
              >
                {filtered ? (
                  <button className="button button-secondary" onClick={reset}>
                    Clear search and filters
                  </button>
                ) : (
                  <Link className="button button-primary" to="/login">
                    Log in to explore
                    <ArrowRight size={16} />
                  </Link>
                )}
              </EmptyState>
            </section>
          )}
          <p className="discovery-fineprint">
            Monthly amounts are tutors’ expectations. Confirm the schedule and
            final fee together before starting.
          </p>
        </section>
      </div>
      <Modal
        open={showLoginPrompt}
        title="Your next connection starts with a login."
        onClose={onDismissLogin}
      >
        <p className="muted">
          Sign in as a guardian to explore and select tutors.
        </p>
        <div className="dialog-actions">
          <button className="button button-secondary" onClick={onDismissLogin}>
            Not now
          </button>
          <button
            className="button button-primary"
            onClick={handleLoginRedirect}
          >
            Log in <ArrowRight size={16} />
          </button>
        </div>
      </Modal>
      <Modal
        open={showAcceptConfirmModal}
        title="Make a connection?"
        onClose={() => {
          if (!selecting) cancelAcceptTutor();
        }}
      >
        <p className="muted">
          You’re expressing interest in <strong>{tutorToConfirm?.name}</strong>.
          We’ll let the tutor know you’re interested in hiring them.
        </p>
        <Notice error>{error}</Notice>
        <div className="dialog-actions">
          <button
            className="button button-secondary"
            onClick={cancelAcceptTutor}
            disabled={selecting}
          >
            Not yet
          </button>
          <button
            className="button button-primary"
            onClick={confirmAcceptTutor}
            disabled={selecting}
          >
            {selecting ? "Saving your selection…" : "Yes, select tutor"}
            <ArrowRight size={16} />
          </button>
        </div>
      </Modal>
    </div>
  );
}
