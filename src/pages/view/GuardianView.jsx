import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  Lightbulb,
  LogOut,
  Plus,
  Search,
  UserRound,
} from "lucide-react";
import {
  ActionCard,
  Avatar,
  EmptyState,
  LoadingState,
  Notice,
  PageHeading,
} from "../../components/ui/Primitives";
export default function GuardianView({
  guardianData,
  loading,
  error,
  recommendedTutors = [],
  recommendationsLoading,
  recommendationsError,
  handleSignOut,
}) {
  if (loading) return <LoadingState label="Opening your learning space…" />;
  return (
    <div className="page-container">
      <PageHeading
        eyebrow="YOUR LEARNING SPACE"
        title="A good day to grow."
        description="Find the right guidance for your learner’s next chapter."
      >
        <button
          className="button button-secondary button-small"
          onClick={handleSignOut}
        >
          <LogOut size={15} />
          <span className="optional-label">Log out</span>
        </button>
      </PageHeading>
      <Notice error>{error}</Notice>
      <section className="dashboard-welcome">
        <div className="welcome-person">
          <Avatar
            name={guardianData?.name}
            src={guardianData?.profileImageUrl}
            size="large"
          />
          <div>
            <span className="eyebrow">GUARDIAN WORKSPACE</span>
            <h2>Welcome back, {guardianData?.name || "learner"}.</h2>
            <p>
              Every learning journey is different. Let’s find the tutor who
              makes yours a little brighter.
            </p>
          </div>
        </div>
        <Link to="/guardian/post-job" className="button button-primary">
          <Plus size={17} /> Post a tuition
        </Link>
      </section>
      <div className="action-grid">
        <ActionCard
          icon={Search}
          title="Find your tutor"
          description="Explore educators and find your learner’s perfect fit."
          to="/browse-tutors"
        />
        <ActionCard
          icon={Bookmark}
          title="Your shortlist"
          description="Review applicants and take the next step together."
          to="/guardian/shortlisted"
          tone="sand"
        />
        <ActionCard
          icon={BriefcaseBusiness}
          title="Manage tuition posts"
          description="Keep track of your requests and learning needs."
          to="/guardian/previous-jobs"
          tone="terra"
        />
      </div>
      <div className="dashboard-columns">
        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Discover your next guide</h2>
              <p>A starting point for your tutor search.</p>
            </div>
            <Link className="text-link" to="/browse-tutors">
              Explore tutors <ArrowUpRight size={15} />
            </Link>
          </div>
          {recommendationsLoading ? (
            <LoadingState label="Finding educators…" />
          ) : recommendationsError ? (
            <Notice error>
              {String(recommendationsError?.message || recommendationsError)}
            </Notice>
          ) : recommendedTutors.length ? (
            <div className="tutor-list">
              {recommendedTutors.slice(0, 5).map((tutor) => (
                <div className="tutor-list-row" key={tutor.id}>
                  <Avatar name={tutor.name} src={tutor.imageUrl} />
                  <div>
                    <h3>{tutor.name}</h3>
                    <p>{tutor.subject || "Tutor · ToppersTrust community"}</p>
                  </div>
                  <Link
                    to="/browse-tutors"
                    aria-label={"Explore tutors including " + tutor.name}
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="Your search starts here"
              description="Explore available tutors or post your requirements to help the right educator find you."
            >
              <Link
                className="button button-secondary button-small"
                to="/browse-tutors"
              >
                Browse tutors <ArrowRight size={15} />
              </Link>
            </EmptyState>
          )}
        </section>
        <aside>
          <section className="panel tip-panel">
            <span className="eyebrow">
              <Lightbulb size={16} /> A LITTLE GUIDANCE
            </span>
            <h3>
              A clearer brief.
              <br />A better connection.
            </h3>
            <p>
              Include your learner’s class, subjects, preferred schedule, and
              location when posting a tuition. The little details help tutors
              understand your needs.
            </p>
            <Link className="text-link" to="/guardian/post-job">
              Share your requirements <ArrowRight size={15} />
            </Link>
          </section>
          <div className="quick-list">
            <Link to="/guardian/profile">
              <UserRound size={17} /> View your profile{" "}
              <ArrowUpRight size={15} />
            </Link>
            <Link to="/guardian/profile/edit">
              <Plus size={17} /> Update your details <ArrowUpRight size={15} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
