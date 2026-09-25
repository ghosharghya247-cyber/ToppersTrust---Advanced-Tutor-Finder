import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  Lightbulb,
  LogOut,
  Megaphone,
  Search,
  UserRound,
  Wallet,
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
export default function TutorView({
  tutorData,
  loading,
  error,
  notifications = [],
  unreadCount,
  showNotificationsPanel,
  notificationPanelRef,
  onNotificationBellClick,
  onSignOut,
  paymentLoading,
  paymentMessage,
  onAdvertiseClick,
}) {
  if (loading && !tutorData?.tutorId)
    return <LoadingState label="Preparing your tutor workspace…" />;
  return (
    <div className="page-container">
      <PageHeading
        eyebrow="YOUR TEACHING SPACE"
        title="Make a little difference."
        description="Your knowledge could be someone’s next breakthrough."
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
            name={tutorData?.name}
            src={tutorData?.profileImageUrl}
            size="large"
          />
          <div>
            <span className="eyebrow">TUTOR WORKSPACE</span>
            <h2>Good to see you, {tutorData?.name || "educator"}.</h2>
            <p>
              Find your next opportunity to inspire. Your teaching journey
              continues here.
            </p>
          </div>
        </div>
        <Link to="/job-card" className="button button-primary">
          Explore tuitions <ArrowUpRight size={17} />
        </Link>
      </section>
      <div className="action-grid">
        <ActionCard
          icon={BriefcaseBusiness}
          title="Find a tuition"
          description="Discover learning needs that match your expertise."
          to="/job-card"
        />
        <ActionCard
          icon={UserRound}
          title="Your teaching profile"
          description="Show guardians what makes your guidance unique."
          to="/tutor/profile"
          tone="sand"
        />
        <ActionCard
          icon={Wallet}
          title="Payments & dues"
          description="Keep your account in order, all in one place."
          to="/tutor/dues"
          tone="terra"
        />
      </div>
      <div className="dashboard-columns">
        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Your latest updates</h2>
              <p>Stay connected to your teaching journey.</p>
            </div>
            <BookOpen size={21} />
          </div>
          {notifications.length ? (
            <div className="tutor-list">
              {notifications.slice(0, 5).map((item) => (
                <div className="tutor-list-row" key={item.id}>
                  <span className="icon-tile sage">
                    <Check size={18} />
                  </span>
                  <div>
                    <p>{item.message}</p>
                    {item.timestamp && (
                      <small className="muted">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </small>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="A fresh page awaits"
              description="Your account updates will appear here. In the meantime, explore new tuition opportunities."
            >
              <Link
                to="/job-card"
                className="button button-secondary button-small"
              >
                Find your next student <ArrowRight size={15} />
              </Link>
            </EmptyState>
          )}
        </section>
        <aside>
          <section className="panel tip-panel">
            <span className="eyebrow">
              <Megaphone size={16} /> PUT YOUR BEST SELF FORWARD
            </span>
            <h3>
              Help more learners
              <br />
              discover you.
            </h3>
            <p>
              Promote your teaching profile to give your expertise more
              visibility.
            </p>
            <div className="billing-detail">
              <strong>Profile promotion</strong>
              <strong>৳200</strong>
            </div>
            <button
              className="button button-primary button-full"
              onClick={onAdvertiseClick}
              disabled={paymentLoading}
            >
              {paymentLoading ? "Opening payment…" : "Promote my profile"}
              <ArrowUpRight size={16} />
            </button>
            <Notice
              error={
                !!paymentMessage &&
                !paymentMessage.toLowerCase().includes("success")
              }
            >
              {paymentMessage}
            </Notice>
          </section>
          <div className="quick-list">
            <Link to="/tutor/profile/edit">
              <Lightbulb size={17} /> Keep your profile up to date{" "}
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
