import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ClipboardList,
  Lightbulb,
  LogOut,
  Plus,
  Search,
} from "lucide-react";
import {
  ActionCard,
  Avatar,
  EmptyState,
  LoadingState,
  Notice,
  Notifications,
  PageHeading,
} from "../../components/ui/Primitives";
export default function MediaView({
  mediaData,
  loading,
  error,
  notifications = [],
  unreadCount,
  showNotificationsPanel,
  notificationPanelRef,
  onNotificationBellClick,
  onSignOut,
  adminRecommendations = [],
  isAdminLoading,
  onSelectTutor,
}) {
  if (loading && !mediaData?.mediaId)
    return <LoadingState label="Opening your partner workspace…" />;
  return (
    <div className="page-container">
      <PageHeading
        eyebrow="YOUR PARTNER SPACE"
        title="Better connections start here."
        description="Bring educators and learning opportunities together."
      >
        <Notifications
          items={notifications}
          unread={unreadCount}
          open={showNotificationsPanel}
          onToggle={onNotificationBellClick}
          panelRef={notificationPanelRef}
        />
        <button
          className="button button-secondary button-small"
          onClick={onSignOut}
        >
          <LogOut size={15} />
          <span className="optional-label">Log out</span>
        </button>
      </PageHeading>
      <Notice error>{error}</Notice>
      <section className="dashboard-welcome">
        <div className="welcome-person">
          <Avatar
            name={mediaData?.name}
            src={mediaData?.profileImageUrl}
            size="large"
          />
          <div>
            <span className="eyebrow">MEDIA PARTNER WORKSPACE</span>
            <h2>Welcome back, {mediaData?.name || "partner"}.</h2>
            <p>
              Great learning happens when the right people meet. Let’s make that
              connection.
            </p>
          </div>
        </div>
        <Link to="/media/post-job" className="button button-primary">
          <Plus size={17} /> Request a tutor
        </Link>
      </section>
      <div className="action-grid">
        <ActionCard
          icon={Search}
          title="Explore educators"
          description="Discover tutors for the learning needs in your network."
          to="/media/browse-tutors"
        />
        <ActionCard
          icon={ClipboardList}
          title="Request a tutor"
          description="Share your requirements with our admin team."
          to="/media/post-job"
          tone="sand"
        />
        <ActionCard
          icon={Building2}
          title="Your partner profile"
          description="Keep your organisation’s details ready to connect."
          to="/media/profile"
          tone="terra"
        />
      </div>
      <div className="dashboard-columns">
        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Recommendations for you</h2>
              <p>Tutor suggestions from the admin team.</p>
            </div>
            <span className="badge">
              {adminRecommendations.length} recommendations
            </span>
          </div>
          {isAdminLoading ? (
            <LoadingState label="Loading recommendations…" />
          ) : adminRecommendations.length ? (
            adminRecommendations.map((rec) => (
              <article className="request-card" key={rec.id}>
                <span className="eyebrow">
                  REQUEST #{rec.media_to_admin?.id || "—"}
                </span>
                <h3>{rec.tutor?.name || "Recommended tutor"}</h3>
                <p>{rec.media_to_admin?.job_description}</p>
                {rec.admin_note && (
                  <p>
                    <strong>Admin note:</strong> {rec.admin_note}
                  </p>
                )}
                {rec.tutor_selected ? (
                  <span className="badge">
                    <Check size={13} /> Tutor selected
                  </span>
                ) : (
                  <button
                    className="button button-primary button-small"
                    onClick={() => onSelectTutor(rec.id)}
                  >
                    Select this tutor <ArrowRight size={15} />
                  </button>
                )}
              </article>
            ))
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="Good connections take a first step"
              description="Submit a tutor request and admin recommendations will appear here."
            >
              <Link
                to="/media/post-job"
                className="button button-secondary button-small"
              >
                Request a tutor <ArrowRight size={15} />
              </Link>
            </EmptyState>
          )}
        </section>
        <section className="panel tip-panel">
          <span className="eyebrow">
            <Lightbulb size={16} /> PARTNER POINTER
          </span>
          <h3>
            Great matches begin
            <br />
            with clear details.
          </h3>
          <p>
            Share subjects, location, schedule, and budget in your tutor request
            so our team can suggest relevant educators.
          </p>
          <Link className="text-link" to="/media/post-job">
            Make a request <ArrowUpRight size={15} />
          </Link>
        </section>
      </div>
    </div>
  );
}
