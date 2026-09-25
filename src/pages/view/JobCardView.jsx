import TinderCard from "react-tinder-card";
import { BookOpen, BriefcaseBusiness, Lightbulb, MapPin } from "lucide-react";
import { useJobCardController } from "../control/useJobCardController";
import {
  EmptyState,
  LoadingState,
  Notice,
  PageHeading,
} from "../../components/ui/Primitives";
import { QueueActions, SearchFilters } from "../../components/ui/Discovery";
import { InfoGrid } from "../../components/ui/ProfilePage";
import Modal from "../../components/ui/Modal";
export default function JobCardView() {
  const c = useJobCardController();
  const hasCard = c.jobs.length > 0 && c.currentIndex >= 0;
  return (
    <div className="page-container">
      <PageHeading
        eyebrow="KNOWLEDGE IS BETTER SHARED"
        title="Find your next tuition."
        description="Discover an opportunity to make a learner’s next breakthrough possible."
      />
      <SearchFilters
        filters={c.filters}
        onChange={c.setFilters}
        onReset={() => c.setFilters({ location: "", gender: "any" })}
        count={c.jobs.length}
      />
      <Notice error>{c.error}</Notice>
      <Notice error={c.actionMessage?.type === "error"}>
        {c.actionMessage?.text}
      </Notice>
      {c.loading ? (
        <LoadingState label="Finding learning opportunities…" />
      ) : (
        <div className="discovery-layout">
          <div className="queue-column">
            <div className="queue-status">
              <span className="eyebrow">EXPLORE AT YOUR OWN PACE</span>
              <span>
                {hasCard ? c.jobs.length - c.currentIndex : 0} / {c.jobs.length}
              </span>
            </div>
            <div className="queue-stack">
              {c.jobs.map((job, index) => (
                <TinderCard
                  key={job.id}
                  ref={c.childRefs[index]}
                  className={
                    index === c.currentIndex
                      ? "queue-slide is-current"
                      : "queue-slide"
                  }
                  preventSwipe={["up", "down"]}
                  onSwipe={(dir) => c.handleSwipe(dir, job, index)}
                  swipeRequirementType="position"
                  swipeThreshold={100}
                >
                  <article
                    className="tuition-card"
                    aria-hidden={index !== c.currentIndex}
                  >
                    <div className="section-heading">
                      <span className="badge">
                        <BriefcaseBusiness size={14} />
                        {job.tuitionType || "Tuition opportunity"}
                      </span>
                      <span className="muted">#{job.code || job.id}</span>
                    </div>
                    <span className="icon-tile sage">
                      <BookOpen size={27} />
                    </span>
                    <h2>{job.title}</h2>
                    <p className="educator-location">
                      <MapPin size={16} />
                      {job.location}
                    </p>
                    <div className="subject-selection">
                      {job.subjects.map((subject) => (
                        <span key={subject} className="subject-chip">
                          {subject}
                        </span>
                      ))}
                    </div>
                    <div className="salary-block">
                      <span>Offered salary</span>
                      <strong>
                        {job.salary
                          ? "৳" + Number(job.salary).toLocaleString()
                          : "Not specified"}
                        <small>
                          {" "}
                          / {job.paymentBasis || "basis not specified"}
                        </small>
                      </strong>
                    </div>
                    <InfoGrid
                      fields={[
                        ["Class / course", job.class],
                        ["Medium", job.medium],
                        ["Days per week", job.daysPerWeek],
                        ["Preferred time", job.tutoringTime],
                        ["Students", job.noOfStudents],
                        ["Student gender", job.studentGender],
                        ["Tutor preference", job.preferredTutor],
                        [
                          "Posted",
                          job.postedDate
                            ? new Date(job.postedDate).toLocaleDateString()
                            : null,
                        ],
                      ]}
                    />
                  </article>
                </TinderCard>
              ))}
              {!hasCard && (
                <section className="panel queue-empty">
                  <EmptyState
                    icon={BriefcaseBusiness}
                    title={
                      c.jobs.length
                        ? "You’ve explored these opportunities"
                        : "No matching tuitions yet"
                    }
                    description="Try another location or reset your filters to explore again."
                  >
                    <button
                      className="button button-secondary"
                      onClick={() =>
                        c.setFilters({ location: "", gender: "any" })
                      }
                    >
                      Reset filters
                    </button>
                  </EmptyState>
                </section>
              )}
            </div>
            {hasCard && (
              <QueueActions
                onSkip={() => c.manualSwipe("left")}
                onAccept={() => c.manualSwipe("right")}
                acceptLabel="Apply for tuition"
                busy={c.actionPending}
              />
            )}
            <p className="queue-hint">
              Use the buttons, or swipe left to skip and right to apply.
            </p>
          </div>
          <aside className="panel tip-panel">
            <span className="eyebrow">
              <Lightbulb size={16} /> FIND YOUR FIT
            </span>
            <h3>
              The right match
              <br />
              goes both ways.
            </h3>
            <p>
              Consider the learner’s subjects, location, and schedule before
              applying. A thoughtful match makes a stronger learning
              partnership.
            </p>
            <ul className="guidance-list">
              <li>Check your availability.</li>
              <li>Review the tuition requirements.</li>
              <li>Keep your teaching profile current.</li>
            </ul>
          </aside>
        </div>
      )}
      <Modal
        open={c.showLoginPrompt}
        title="Sign in to take the next step."
        onClose={() => c.setShowLoginPrompt(false)}
      >
        <p className="muted">
          Log in as a tutor to apply for tuition opportunities.
        </p>
        <div className="dialog-actions">
          <button
            className="button button-secondary"
            onClick={() => c.setShowLoginPrompt(false)}
          >
            Not now
          </button>
          <button
            className="button button-primary"
            onClick={() => c.navigate("/login")}
          >
            Log in
          </button>
        </div>
      </Modal>
    </div>
  );
}
