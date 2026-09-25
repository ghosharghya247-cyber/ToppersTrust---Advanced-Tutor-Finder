import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Search, SlidersHorizontal } from "lucide-react";
import {
  EmptyState,
  LoadingState,
  Notice,
  PageHeading,
} from "../../components/ui/Primitives";
import { Pagination, TutorPreview } from "../../components/ui/Discovery";
import Modal from "../../components/ui/Modal";
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
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const matches = useMemo(() => {
    const list = tutors.filter((t) =>
      [t.name, t.location, t.university, t.department, t.preferred_subjects]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    );
    return sort === "name"
      ? list.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
      : sort === "rating"
        ? list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
        : list;
  }, [tutors, query, sort]);
  const pages = Math.max(1, Math.ceil(matches.length / 6));
  const safePage = Math.min(page, pages);
  return (
    <div className="page-container">
      <PageHeading
        eyebrow="GOOD GUIDANCE IS CLOSER THAN YOU THINK"
        title={
          isBrowsePage
            ? "Find your next guide."
            : "Tutors worth getting to know."
        }
        description="Explore educators, compare their experience, and find your learner’s fit."
      >
        <Link
          className="button button-secondary button-small"
          to="/guardian/post-job"
        >
          <Plus size={16} /> Post a tuition
        </Link>
      </PageHeading>
      <div className="discovery-banner">
        <span className="icon-tile sage">
          <Search size={24} />
        </span>
        <div>
          <h2>There’s more than one way to learn.</h2>
          <p>
            Start with a subject, university, name, or location. Take a closer
            look at the people behind the profiles.
          </p>
        </div>
      </div>
      <div className="filter-bar">
        <div className="field">
          <label htmlFor="tutor-search">Find an educator</label>
          <div className="search-input">
            <Search size={18} />
            <input
              id="tutor-search"
              type="search"
              placeholder="Name, subject, university, or area…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="tutor-sort">Sort by</label>
          <select
            id="tutor-sort"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="default">Recommended order</option>
            <option value="name">Name · A to Z</option>
            <option value="rating">Highest rated</option>
          </select>
        </div>
        <span className="filter-count" role="status">
          {matches.length} tutors
        </span>
      </div>
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
                  I’m interested <ArrowRight size={16} />
                </button>
              </TutorPreview>
            ))}
          </div>
          {pages > 1 && (
            <Pagination page={safePage} pages={pages} onChange={setPage} />
          )}
        </>
      ) : (
        <section className="panel">
          <EmptyState
            icon={Search}
            title={
              query ? "No matches just yet" : "Your tutor search starts here"
            }
            description={
              query
                ? "Try another name, subject, or location."
                : "Available tutors will appear here when you’re signed in and profiles are ready."
            }
          >
            {query ? (
              <button
                className="button button-secondary"
                onClick={() => setQuery("")}
              >
                Clear search
              </button>
            ) : (
              <Link className="button button-primary" to="/login">
                Log in to explore <ArrowRight size={16} />
              </Link>
            )}
          </EmptyState>
        </section>
      )}
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
