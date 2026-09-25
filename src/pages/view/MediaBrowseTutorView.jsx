import TinderCard from "react-tinder-card";
import { GraduationCap, Lightbulb, Search } from "lucide-react";
import { useMediaBrowseTutorController } from "../control/MediaBrowseTutorController";
import {
  EmptyState,
  LoadingState,
  Notice,
  PageHeading,
} from "../../components/ui/Primitives";
import {
  QueueActions,
  SearchFilters,
  TutorPreview,
} from "../../components/ui/Discovery";
import Modal from "../../components/ui/Modal";
export default function MediaBrowseTutorView() {
  const c = useMediaBrowseTutorController();
  const hasCard = c.tutors.length > 0 && c.currentIndex >= 0;
  return (
    <div className="page-container">
      <PageHeading
        eyebrow="BUILD YOUR TEACHING NETWORK"
        title="Meet your next educator."
        description="Explore tutors and create connections that make better learning possible."
      />
      <SearchFilters
        filters={c.filters}
        onChange={c.setFilters}
        onReset={() => c.setFilters({ location: "", gender: "any" })}
        count={c.tutors.length}
        noun="educators"
      />
      <Notice error>{c.error}</Notice>
      <Notice error={c.actionMessage?.type === "error"}>
        {c.actionMessage?.text}
      </Notice>
      {c.loading ? (
        <LoadingState label="Finding educators…" />
      ) : (
        <div className="discovery-layout">
          <div className="queue-column">
            <div className="queue-status">
              <span className="eyebrow">ONE GOOD CONNECTION AT A TIME</span>
              <span>
                {hasCard ? c.tutors.length - c.currentIndex : 0} /{" "}
                {c.tutors.length}
              </span>
            </div>
            <div className="queue-stack educator-stack">
              {c.tutors.map((tutor, index) => (
                <TinderCard
                  key={tutor.id}
                  ref={c.childRefs[index]}
                  className={
                    index === c.currentIndex
                      ? "queue-slide is-current"
                      : "queue-slide"
                  }
                  preventSwipe={["up", "down"]}
                  onSwipe={(dir) => c.handleSwipe(dir, tutor, index)}
                  swipeRequirementType="position"
                  swipeThreshold={100}
                >
                  <div
                    aria-hidden={index !== c.currentIndex}
                    inert={index !== c.currentIndex ? "" : undefined}
                  >
                    <TutorPreview tutor={tutor} />
                  </div>
                </TinderCard>
              ))}
              {!hasCard && (
                <section className="panel queue-empty">
                  <EmptyState
                    icon={Search}
                    title={
                      c.tutors.length
                        ? "You’ve explored these educators"
                        : "No matching educators yet"
                    }
                    description="Try another area or reset the filters to explore available profiles."
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
                busy={c.actionPending}
              />
            )}
            <p className="queue-hint">
              Use the buttons, or swipe left to skip and right to select.
            </p>
          </div>
          <aside className="panel tip-panel">
            <span className="eyebrow">
              <Lightbulb size={16} /> CONNECTIONS THAT COUNT
            </span>
            <h3>
              Look beyond
              <br />
              the first impression.
            </h3>
            <p>
              Review each tutor’s education, experience, and availability.
              Select educators whose strengths suit the learners in your
              network.
            </p>
            <ul className="guidance-list">
              <li>Compare qualifications and subjects.</li>
              <li>Consider location and availability.</li>
              <li>Expand a profile to learn more.</li>
            </ul>
            <span className="icon-tile sand">
              <GraduationCap size={25} />
            </span>
          </aside>
        </div>
      )}
      <Modal
        open={c.showLoginPrompt}
        title="Continue in your partner account."
        onClose={() => c.setShowLoginPrompt(false)}
      >
        <p className="muted">Log in as a media partner to select tutors.</p>
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
