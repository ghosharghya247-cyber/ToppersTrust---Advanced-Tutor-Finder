import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Edit3,
  LogOut,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Avatar, Notice, PageHeading } from "./Primitives";

export function ProfileLink({ value, label = "Open link" }) {
  if (!value) return "Not provided";
  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : "https://" + value,
    );
    if (!["http:", "https:"].includes(url.protocol)) return "Not provided";
    return (
      <a
        className="text-link"
        href={url.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
        <ArrowUpRight size={14} />
      </a>
    );
  } catch {
    return "Not provided";
  }
}
export function InfoGrid({ fields }) {
  return (
    <dl className="info-grid">
      {fields.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>
            {Array.isArray(value)
              ? value.join(", ") || "Not provided"
              : value || "Not provided"}
          </dd>
        </div>
      ))}
    </dl>
  );
}
export function ProfileSection({ title, description, children, open = true }) {
  return (
    <details className="panel profile-section" open={open}>
      <summary>
        <span>
          <strong>{title}</strong>
          {description && <small>{description}</small>}
        </span>
        <ChevronDown size={19} />
      </summary>
      <div className="profile-section-body">{children}</div>
    </details>
  );
}
export default function ProfilePage({
  data = {},
  role = "guardian",
  error,
  onBack,
  onSignOut,
  children,
}) {
  const label =
    role === "media" ? "Partner" : role === "tutor" ? "Tutor" : "Guardian";
  const completion = Math.min(
    100,
    Math.max(0, Number(data.profileCompletion) || 0),
  );
  return (
    <div className="page-container">
      <PageHeading
        eyebrow="YOUR ACCOUNT, AT A GLANCE"
        title={role === "media" ? "Your partner profile." : "Your profile."}
        description="Keep your details current. Make your next connection count."
      >
        <button
          className="button button-secondary button-small"
          onClick={onBack}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </PageHeading>
      <Notice error>{error}</Notice>
      <div className="profile-layout">
        <aside className="panel profile-summary">
          <Avatar
            name={data.name || label}
            src={data.profileImageUrl}
            size="xlarge"
          />
          <span className="eyebrow">{label.toUpperCase()} PROFILE</span>
          <h2>{data.name || "Your name"}</h2>
          <p className="muted">
            Member ID ·{" "}
            {data.tutorId || data.guardianId || data.mediaId || "Not assigned"}
          </p>
          <div className="profile-completion">
            <div>
              <span>Profile complete</span>
              <strong>{completion}%</strong>
            </div>
            <progress
              max="100"
              value={completion}
              aria-label="Profile completion"
            />
            <p>
              {completion === 100
                ? "Looking good. Your details are up to date."
                : "A few more details help people get to know you."}
            </p>
          </div>
          <Link
            className="button button-primary button-full"
            to={"/" + role + "/profile/edit"}
          >
            <Edit3 size={16} /> Edit profile
          </Link>
          <div className="profile-contact">
            <p>
              <Mail size={16} />
              <span>{data.email || "Email not provided"}</span>
            </p>
            <p>
              <MapPin size={16} />
              <span>
                {data.location ||
                  data.city ||
                  data.address ||
                  "Add your location"}
              </span>
            </p>
          </div>
          {onSignOut && (
            <button
              className="button button-secondary button-full"
              onClick={onSignOut}
            >
              <LogOut size={16} /> Log out
            </button>
          )}
          <p className="privacy-note">
            <ShieldCheck size={16} /> These are your account details. Keep
            sensitive information up to date.
          </p>
        </aside>
        <div className="profile-details">{children}</div>
      </div>
    </div>
  );
}
export function AccountProfile({
  guardianData: data = {},
  error,
  handleSignOut,
  navigateToDashboard,
  role,
}) {
  return (
    <ProfilePage
      data={data}
      role={role}
      error={error}
      onBack={navigateToDashboard}
      onSignOut={handleSignOut}
    >
      <ProfileSection
        title={
          role === "media" ? "Partner information" : "Personal information"
        }
        description="The essentials for staying connected."
      >
        <InfoGrid
          fields={[
            ["Full name", data.name],
            ["Email address", data.email],
            ["Contact number", data.contactNumber],
            ["City", data.city],
            ["Address", data.address],
            [
              "Facebook profile",
              <ProfileLink value={data.facebookProfile} label="View profile" />,
            ],
            ...(role === "guardian"
              ? [["Relation with student", data.relationWithStudent]]
              : []),
          ]}
        />
      </ProfileSection>
      <ProfileSection
        title="Verification & security"
        description="Your account’s current verification status."
      >
        <div className="verification-card">
          <span className="icon-tile sage">
            <ShieldCheck size={24} />
          </span>
          <div>
            <h3>
              {data.isVerified
                ? "Your account is verified"
                : "Not yet verified"}
            </h3>
            <p>
              {data.isVerified
                ? "Your verification status is up to date."
                : "Complete your profile to keep your account ready for review."}
            </p>
          </div>
          {data.isVerified && <CheckCircle2 size={20} />}
        </div>
      </ProfileSection>
    </ProfilePage>
  );
}
