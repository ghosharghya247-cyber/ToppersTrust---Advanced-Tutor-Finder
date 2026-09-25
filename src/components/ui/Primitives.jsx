import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  LoaderCircle,
  Users,
  Building2,
  Bell,
  X,
  Inbox,
} from "lucide-react";

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Toppers Trust home">
      <span className="brand-mark">
        <BookOpen size={23} strokeWidth={1.8} />
      </span>
      <span>
        Toppers<span className="brand-light">Trust</span>
        <small>ROOM TO GROW.</small>
      </span>
    </Link>
  );
}
export function Avatar({ name = "Member", src, size = "" }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <span className={`avatar ${size}`} aria-label={name}>
      {src && !failed ? (
        <img src={src} alt={name} onError={() => setFailed(true)} />
      ) : (
        name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((word) => word[0])
          .join("")
          .toUpperCase()
      )}
    </span>
  );
}
export function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {children && <div className="heading-actions">{children}</div>}
    </div>
  );
}
export function ActionCard({
  icon: Icon = BookOpen,
  title,
  description,
  to,
  tone = "sage",
}) {
  return (
    <Link className="action-card" to={to}>
      <span className={`icon-tile ${tone}`}>
        <Icon size={23} />
      </span>
      <ArrowUpRight className="card-arrow" size={19} />
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
}
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  children,
}) {
  return (
    <div className="empty-state">
      <span className="icon-tile sage">
        <Icon size={26} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
export function LoadingState({ label = "Getting things ready…" }) {
  return (
    <div className="loading-state" role="status">
      <span className="loading-mark">
        <BookOpen size={30} />
      </span>
      <LoaderCircle className="spin" size={21} />
      <p>{label}</p>
    </div>
  );
}
export function Notice({ children, error = false }) {
  return children ? (
    <div
      className={`notice ${error ? "notice-error" : ""}`}
      role={error ? "alert" : "status"}
    >
      {children}
    </div>
  ) : null;
}
export function RolePicker({ value, onChange, signup = false }) {
  const roles = [
    {
      value: signup ? "guardian" : "tutor",
      title: "Guardian",
      detail: "Find a tutor",
      Icon: Users,
    },
    {
      value: "teacher",
      title: "Tutor",
      detail: "Share your skills",
      Icon: GraduationCap,
    },
    {
      value: "media",
      title: "Partner",
      detail: "Connect talent",
      Icon: Building2,
    },
  ];
  return (
    <fieldset className="role-fieldset">
      <legend>I’m here as a</legend>
      <div className="role-options">
        {roles.map(({ value: role, title, detail, Icon }) => (
          <button
            type="button"
            key={role}
            className={`role-option ${value === role ? "selected" : ""}`}
            aria-pressed={value === role}
            onClick={() => onChange(role)}
          >
            <Icon size={21} />
            <strong>{title}</strong>
            <small>{detail}</small>
            {value === role && <Check className="role-check" size={14} />}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
export function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete = "current-password",
  error,
  placeholder = "Enter your password",
  name,
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="password-input">
        <input
          id={id}
          name={name || id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <small id={`${id}-error`} className="field-error">
          {error}
        </small>
      )}
    </div>
  );
}
export function Notifications({
  items = [],
  unread = 0,
  open,
  onToggle,
  panelRef,
}) {
  return (
    <div className="notification-wrap">
      <button
        id="notification-bell-button"
        className="icon-button"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
        onClick={onToggle}
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="notification-count">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <section
          ref={panelRef}
          className="notification-panel"
          aria-label="Notifications"
        >
          <div className="section-heading">
            <h3>Your updates</h3>
            <button
              className="icon-button"
              aria-label="Close notifications"
              onClick={onToggle}
            >
              <X size={18} />
            </button>
          </div>
          {items.length ? (
            <ul>
              {items.map((item) => (
                <li key={item.id} className={item.isRead ? "" : "unread"}>
                  <p>{item.message}</p>
                  {item.timestamp && (
                    <small>
                      {new Date(item.timestamp).toLocaleDateString()}
                    </small>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="All caught up"
              description="New opportunities and account updates will appear here."
            />
          )}
        </section>
      )}
    </div>
  );
}
export function LearningArtwork() {
  return (
    <div className="learning-art" aria-hidden="true">
      <div className="art-orbit" />
      <span className="art-spark one">✳</span>
      <span className="art-spark two">✦</span>
      <div className="art-note">
        <span className="note-label">A LITTLE EVERY DAY</span>
        <h3>
          Big dreams.
          <br />
          Small steps.
        </h3>
        <div className="note-rule" />
        <p>Curiosity + the right guidance</p>
        <strong>= endless possibilities.</strong>
        <div className="note-check">
          <Check size={14} /> Find your starting point
        </div>
        <div className="note-check">
          <Check size={14} /> Learn at your own pace
        </div>
        <div className="note-check">
          <Check size={14} /> Grow with confidence
        </div>
      </div>
      <div className="art-book book-one">
        <BookOpen size={20} /> THE ART OF LEARNING
      </div>
      <div className="art-book book-two">
        A new chapter starts here <span>01</span>
      </div>
      <div className="art-badge">
        <GraduationCap size={24} />
        <span>
          Made for
          <br />
          <strong>your potential.</strong>
        </span>
      </div>
    </div>
  );
}
